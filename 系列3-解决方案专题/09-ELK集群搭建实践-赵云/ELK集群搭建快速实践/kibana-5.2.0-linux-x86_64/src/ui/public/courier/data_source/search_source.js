/*
 * Copyright 2021-2022 the original author or authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @name SearchSource
 *
 * @description A promise-based stream of search results that can inherit from other search sources.
 *
 * Because filters/queries in Kibana have different levels of persistence and come from different
 * places, it is important to keep track of where filters come from for when they are saved back to
 * the savedObject store in the Kibana index. To do this, we create trees of searchSource objects
 * that can have associated query parameters (index, query, filter, etc) which can also inherit from
 * other searchSource objects.
 *
 * At query time, all of the searchSource objects that have subscribers are "flattened", at which
 * point the query params from the searchSource are collected while traversing up the inheritance
 * chain. At each link in the chain a decision about how to merge the query params is made until a
 * single set of query parameters is created for each active searchSource (a searchSource with
 * subscribers).
 *
 * That set of query parameters is then sent to elasticsearch. This is how the filter hierarchy
 * works in Kibana.
 *
 * Visualize, starting from a new search:
 *
 *  - the `savedVis.searchSource` is set as the `appSearchSource`.
 *  - The `savedVis.searchSource` would normally inherit from the `appSearchSource`, but now it is
 *    upgraded to inherit from the `rootSearchSource`.
 *  - Any interaction with the visualization will still apply filters to the `appSearchSource`, so
 *    they will be stored directly on the `savedVis.searchSource`.
 *  - Any interaction with the time filter will be written to the `rootSearchSource`, so those
 *    filters will not be saved by the `savedVis`.
 *  - When the `savedVis` is saved to elasticsearch, it takes with it all the filters that are
 *    defined on it directly, but none of the ones that it inherits from other places.
 *
 * Visualize, starting from an existing search:
 *
 *  - The `savedVis` loads the `savedSearch` on which it is built.
 *  - The `savedVis.searchSource` is set to inherit from the `saveSearch.searchSource` and set as
 *    the `appSearchSource`.
 *  - The `savedSearch.searchSource`, is set to inherit from the `rootSearchSource`.
 *  - Then the `savedVis` is written to elasticsearch it will be flattened and only include the
 *    filters created in the visualize application and will reconnect the filters from the
 *    `savedSearch` at runtime to prevent losing the relationship
 *
 * Dashboard search sources:
 *
 *  - Each panel in a dashboard has a search source.
 *  - The `savedDashboard` also has a searchsource, and it is set as the `appSearchSource`.
 *  - Each panel's search source inherits from the `appSearchSource`, meaning that they inherit from
 *    the dashboard search source.
 *  - When a filter is added to the search box, or via a visualization, it is written to the
 *    `appSearchSource`.
 */

import _ from 'lodash';

import NormalizeSortRequestProvider from './_normalize_sort_request';
import rootSearchSource from './_root_search_source';
import AbstractDataSourceProvider from './_abstract';
import SearchRequestProvider from '../fetch/request/search';
import SegmentedRequestProvider from '../fetch/request/segmented';
import SearchStrategyProvider from '../fetch/strategy/search';

export default function SearchSourceFactory(Promise, Private, config) {
  let SourceAbstract = Private(AbstractDataSourceProvider);
  let SearchRequest = Private(SearchRequestProvider);
  let SegmentedRequest = Private(SegmentedRequestProvider);
  let searchStrategy = Private(SearchStrategyProvider);
  let normalizeSortRequest = Private(NormalizeSortRequestProvider);

  let forIp = Symbol('for which index pattern?');

  function isIndexPattern(val) {
    return Boolean(val && typeof val.toIndexList === 'function');
  }

  _.class(SearchSource).inherits(SourceAbstract);
  function SearchSource(initialState) {
    SearchSource.Super.call(this, initialState, searchStrategy);
  }

  /*****
   * PUBLIC API
   *****/

  /**
   * List of the editable state properties that turn into a
   * chainable API
   *
   * @type {Array}
   */
  SearchSource.prototype._methods = [
    'type',
    'query',
    'filter',
    'sort',
    'highlight',
    'aggs',
    'from',
    'size',
    'source'
  ];

  SearchSource.prototype.index = function (indexPattern) {
    let state = this._state;

    let hasSource = state.source;
    let sourceCameFromIp = hasSource && state.source.hasOwnProperty(forIp);
    let sourceIsForOurIp = sourceCameFromIp && state.source[forIp] === state.index;
    if (sourceIsForOurIp) {
      delete state.source;
    }

    if (indexPattern === undefined) return state.index;
    if (indexPattern === null) return delete state.index;
    if (!isIndexPattern(indexPattern)) {
      throw new TypeError('expected indexPattern to be an IndexPattern duck.');
    }

    state.index = indexPattern;
    if (!state.source) {
      // imply source filtering based on the index pattern, but allow overriding
      // it by simply setting another value for "source". When index is changed
      state.source = function () {
        return indexPattern.getSourceFiltering();
      };
      state.source[forIp] = indexPattern;
    }

    return this;
  };

  SearchSource.prototype.extend = function () {
    return (new SearchSource()).inherits(this);
  };

  /**
   * Set a searchSource that this source should inherit from
   * @param  {SearchSource} searchSource - the parent searchSource
   * @return {this} - chainable
   */
  SearchSource.prototype.inherits = function (parent) {
    this._parent = parent;
    return this;
  };

  /**
   * Get the parent of this SearchSource
   * @return {undefined|searchSource}
   */
  SearchSource.prototype.getParent = function (onlyHardLinked) {
    let self = this;
    if (self._parent === false) return;
    if (self._parent) return self._parent;
    return onlyHardLinked ? undefined : Private(rootSearchSource).get();
  };

  /**
   * Temporarily prevent this Search from being fetched... not a fan but it's easy
   */
  SearchSource.prototype.disable = function () {
    this._fetchDisabled = true;
  };

  /**
   * Reverse of SourceAbstract#disable(), only need to call this if source was previously disabled
   */
  SearchSource.prototype.enable = function () {
    this._fetchDisabled = false;
  };

  SearchSource.prototype.onBeginSegmentedFetch = function (initFunction) {
    let self = this;
    return Promise.try(function addRequest() {
      let req = new SegmentedRequest(self, Promise.defer(), initFunction);

      // return promises created by the completion handler so that
      // errors will bubble properly
      return req.defer.promise.then(addRequest);
    });
  };


  /******
   * PRIVATE APIS
   ******/

  /**
   * Gets the type of the DataSource
   * @return {string}
   */
  SearchSource.prototype._getType = function () {
    return 'search';
  };

  /**
   * Create a common search request object, which should
   * be put into the pending request queye, for this search
   * source
   *
   * @param {Deferred} defer - the deferred object that should be resolved
   *                         when the request is complete
   * @return {SearchRequest}
   */
  SearchSource.prototype._createRequest = function (defer) {
    return new SearchRequest(this, defer);
  };

  /**
   * Used to merge properties into the state within ._flatten().
   * The state is passed in and modified by the function
   *
   * @param  {object} state - the current merged state
   * @param  {*} val - the value at `key`
   * @param  {*} key - The key of `val`
   * @return {undefined}
   */
  SearchSource.prototype._mergeProp = function (state, val, key) {
    if (typeof val === 'function') {
      let source = this;
      return Promise.cast(val(this))
      .then(function (newVal) {
        return source._mergeProp(state, newVal, key);
      });
    }

    if (val == null || !key || !_.isString(key)) return;

    switch (key) {
      case 'filter':
        let verifiedFilters = val;
        if (config.get('courier:ignoreFilterIfFieldNotInIndex')) {
          if (!_.isArray(val)) val = [val];
          verifiedFilters = val.filter(function (el) {
            if ('meta' in el && 'index' in state) {
              const field = state.index.fields.byName[el.meta.key];
              if (!field) return false;
            }
            return true;
          });
        }
        // user a shallow flatten to detect if val is an array, and pull the values out if it is
        state.filters = _([ state.filters || [], verifiedFilters ])
        .flatten()
        // Yo Dawg! I heard you needed to filter out your filters
        .reject(function (filter) {
          return !filter || _.get(filter, 'meta.disabled');
        })
        .value();
        return;
      case 'index':
      case 'type':
      case 'id':
        if (key && state[key] == null) {
          state[key] = val;
        }
        return;
      case 'source':
        key = '_source';
        addToBody();
        break;
      case 'sort':
        val = normalizeSortRequest(val, this.get('index'));
        addToBody();
        break;
      default:
        addToBody();
    }

    /**
     * Add the key and val to the body of the resuest
     */
    function addToBody() {
      state.body = state.body || {};
      // ignore if we already have a value
      if (state.body[key] == null) {
        if (key === 'query' && _.isString(val)) {
          val = { query_string: { query: val }};
        }

        state.body[key] = val;
      }
    }
  };

  return SearchSource;
};
