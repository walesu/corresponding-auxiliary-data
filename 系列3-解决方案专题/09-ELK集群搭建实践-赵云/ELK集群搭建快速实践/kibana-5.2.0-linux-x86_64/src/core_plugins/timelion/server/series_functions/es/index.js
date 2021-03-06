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

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libAgg_response_to_series_list = require('./lib/agg_response_to_series_list');

var _libAgg_response_to_series_list2 = _interopRequireDefault(_libAgg_response_to_series_list);

var _ = require('lodash');
var moment = require('moment');
var toMS = require('../../lib/to_milliseconds.js');
var Datasource = require('../../lib/classes/datasource');
var buildRequest = require('./lib/build_request');

module.exports = new Datasource('es', {
  args: [{
    name: 'q',
    types: ['string', 'null'],
    multi: true,
    help: 'Query in lucene query string syntax'
  }, {
    name: 'metric',
    types: ['string', 'null'],
    multi: true,
    help: 'An elasticsearch single value metric agg, eg avg, sum, min, max or cardinality, followed by a field.' + ' Eg "sum:bytes", or just "count"'
  }, {
    name: 'split',
    types: ['string', 'null'],
    multi: true,
    help: 'An elasticsearch field to split the series on and a limit. Eg, "hostname:10" to get the top 10 hostnames'
  }, {
    name: 'index',
    types: ['string', 'null'],
    help: 'Index to query, wildcards accepted'
  }, {
    name: 'timefield',
    types: ['string', 'null'],
    help: 'Field of type "date" to use for x-axis'
  }, {
    name: 'kibana',
    types: ['boolean', 'null'],
    help: 'Respect filters on Kibana dashboards. Only has an effect when using on Kibana dashboards'
  }, {
    name: 'interval', // You really shouldn't use this, use the interval picker instead
    types: ['string', 'null'],
    help: '**DO NOT USE THIS**. Its fun for debugging fit functions, but you really should use the interval picker'
  }],
  help: 'Pull data from an elasticsearch instance',
  aliases: ['elasticsearch'],
  fn: function esFn(args, tlConfig) {

    var config = _.defaults(_.clone(args.byName), {
      q: '*',
      metric: ['count'],
      index: tlConfig.settings['timelion:es.default_index'],
      timefield: tlConfig.settings['timelion:es.timefield'],
      interval: tlConfig.time.interval,
      kibana: true,
      fit: 'nearest'
    });

    var _tlConfig$server$plugins$elasticsearch$getCluster = tlConfig.server.plugins.elasticsearch.getCluster('data');

    var callWithRequest = _tlConfig$server$plugins$elasticsearch$getCluster.callWithRequest;

    var body = buildRequest(config, tlConfig);

    return callWithRequest(tlConfig.request, 'search', body).then(function (resp) {
      if (!resp._shards.total) throw new Error('Elasticsearch index not found: ' + config.index);
      return {
        type: 'seriesList',
        list: (0, _libAgg_response_to_series_list2['default'])(resp.aggregations, config)
      };
    });
  }
});
