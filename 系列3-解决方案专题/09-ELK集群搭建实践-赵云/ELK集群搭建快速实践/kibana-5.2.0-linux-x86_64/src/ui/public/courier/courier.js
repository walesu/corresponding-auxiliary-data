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

import _ from 'lodash';

import errors from 'ui/errors';
import 'ui/es';
import 'ui/promises';
import 'ui/safe_confirm';
import 'ui/index_patterns';
import uiModules from 'ui/modules';
import Notifier from 'ui/notify/notifier';

import DocSourceProvider from './data_source/doc_source';
import SearchSourceProvider from './data_source/search_source';
import SearchStrategyProvider from './fetch/strategy/search';
import RequestQueueProvider from './_request_queue';
import ErrorHandlersProvider from './_error_handlers';
import FetchProvider from './fetch';
import DocDataLooperProvider from './looper/doc_data';
import DocAdminLooperProvider from './looper/doc_admin';
import SearchLooperProvider from './looper/search';
import RootSearchSourceProvider from './data_source/_root_search_source';
import SavedObjectProvider from './saved_object';
import RedirectWhenMissingProvider from './_redirect_when_missing';


uiModules.get('kibana/courier')
.service('courier', function ($rootScope, Private, Promise, indexPatterns) {
  function Courier() {
    let self = this;

    let DocSource = Private(DocSourceProvider);
    let SearchSource = Private(SearchSourceProvider);
    let searchStrategy = Private(SearchStrategyProvider);

    let requestQueue = Private(RequestQueueProvider);
    let errorHandlers = Private(ErrorHandlersProvider);

    let fetch = Private(FetchProvider);
    let docDataLooper = self.docLooper = Private(DocDataLooperProvider);
    let docAdminLooper = self.docLooper = Private(DocAdminLooperProvider);
    let searchLooper = self.searchLooper = Private(SearchLooperProvider);

    // expose some internal modules
    self.setRootSearchSource = Private(RootSearchSourceProvider).set;

    self.SavedObject = Private(SavedObjectProvider);
    self.indexPatterns = indexPatterns;
    self.redirectWhenMissing = Private(RedirectWhenMissingProvider);

    self.DocSource = DocSource;
    self.SearchSource = SearchSource;

    let HastyRefresh = errors.HastyRefresh;

    /**
     * update the time between automatic search requests
     *
     * @chainable
     */
    self.fetchInterval = function (ms) {
      searchLooper.ms(ms);
      return this;
    };

    /**
     * Start fetching search requests on an interval
     * @chainable
     */
    self.start = function () {
      searchLooper.start();
      docDataLooper.start();
      docAdminLooper.start();
      return this;
    };

    /**
     * Process the pending request queue right now, returns
     * a promise that resembles the success of the fetch completing,
     * individual errors are routed to their respective requests.
     */
    self.fetch = function () {
      fetch.fetchQueued(searchStrategy).then(function () {
        searchLooper.restart();
      });
    };


    /**
     * is the currior currently fetching search
     * results automatically?
     *
     * @return {boolean}
     */
    self.started = function () {
      return searchLooper.started();
    };


    /**
     * stop the courier from fetching more search
     * results, does not stop vaidating docs.
     *
     * @chainable
     */
    self.stop = function () {
      searchLooper.stop();
      return this;
    };


    /**
     * create a source object that is a child of this courier
     *
     * @param {string} type - the type of Source to create
     */
    self.createSource = function (type) {
      switch (type) {
        case 'doc':
          return new DocSource();
        case 'search':
          return new SearchSource();
      }
    };

    /**
     * Abort all pending requests
     * @return {[type]} [description]
     */
    self.close = function () {
      searchLooper.stop();
      docAdminLooper.stop();
      docDataLooper.stop();

      _.invoke(requestQueue, 'abort');

      if (requestQueue.length) {
        throw new Error('Aborting all pending requests failed.');
      }
    };

    // Listen for refreshInterval changes
    $rootScope.$watchCollection('timefilter.refreshInterval', function () {
      let refreshValue = _.get($rootScope, 'timefilter.refreshInterval.value');
      let refreshPause = _.get($rootScope, 'timefilter.refreshInterval.pause');
      if (_.isNumber(refreshValue) && !refreshPause) {
        self.fetchInterval(refreshValue);
      } else {
        self.fetchInterval(0);
      }
    });

    let onFatalDefer = Promise.defer();
    onFatalDefer.promise.then(self.close);
    Notifier.fatalCallbacks.push(onFatalDefer.resolve);
  }

  return new Courier();
});
