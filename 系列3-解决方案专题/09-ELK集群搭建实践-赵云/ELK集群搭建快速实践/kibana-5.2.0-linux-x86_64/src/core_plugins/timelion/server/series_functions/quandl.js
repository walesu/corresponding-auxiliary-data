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

var _ = require('lodash');
var fetch = require('node-fetch');
var moment = require('moment');
fetch.Promise = require('bluebird');
//var parseDateMath = require('../utils/date_math.js');

var Datasource = require('../lib/classes/datasource');

module.exports = new Datasource('quandl', {
  dataSource: true,
  args: [{
    name: 'code',
    types: ['string', 'null'],
    help: 'The quandl code to plot. You can find these on quandl.com.'
  }, {
    name: 'position',
    types: ['number', 'null'],
    help: 'Some quandl sources return multiple series, which one should I use? 1 based index.'
  }],
  help: '\n    [experimental]\n    Pull data from quandl.com using the quandl code. Set "timelion:quandl.key" to your free API key in Kibana\'s\n    Advanced Settings. The API has a really low rate limit without a key.',
  fn: function quandlFn(args, tlConfig) {
    var intervalMap = {
      '1d': 'daily',
      '1w': 'weekly',
      '1M': 'monthly',
      '1y': 'annual'
    };

    var config = _.defaults(args.byName, {
      code: 'WIKI/AAPL',
      position: 1,
      interval: intervalMap[tlConfig.time.interval],
      apikey: tlConfig.settings['timelion:quandl.key']
    });

    if (!config.interval) {
      throw new Error('quandl() unsupported interval: ' + tlConfig.time.interval + '. quandl() supports: ' + _.keys(intervalMap).join(', '));
    }

    var time = {
      min: moment.utc(tlConfig.time.from).format('YYYY-MM-DD'),
      max: moment.utc(tlConfig.time.to).format('YYYY-MM-DD')
    };

    // POSITIONS
    // 1. open
    // 2. high
    // 3. low
    // 4. close
    // 5. volume

    var URL = 'https://www.quandl.com/api/v1/datasets/' + config.code + '.json' + '?sort_order=asc' + '&trim_start=' + time.min + '&trim_end=' + time.max + '&collapse=' + config.interval + '&auth_token=' + config.apikey;

    return fetch(URL).then(function (resp) {
      return resp.json();
    }).then(function (resp) {
      var data = _.map(resp.data, function (bucket) {
        return [moment(bucket[0]).valueOf(), bucket[config.position]];
      });

      return {
        type: 'seriesList',
        list: [{
          data: data,
          type: 'series',
          fit: 'nearest',
          label: resp.name
        }]
      };
    })['catch'](function (e) {
      throw e;
    });
  }
});
