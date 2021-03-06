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
var worldbank = require('./worldbank.js');
var Promise = require('bluebird');
var Datasource = require('../lib/classes/datasource');

module.exports = new Datasource('worldbank_indicators', {
  args: [{
    name: 'country', // countries/all/indicators/SP.POP.TOTL
    types: ['string', 'null'],
    help: 'Worldbank country identifier. Usually the country\'s 2 letter code'
  }, {
    name: 'indicator',
    types: ['string', 'null'],
    help: 'The indicator code to use. You\'ll have to look this up on data.worldbank.org.' + ' Often pretty obtuse. Eg SP.POP.TOTL is population'
  }],
  aliases: ['wbi'],
  help: '\n    [experimental]\n    Pull data from http://data.worldbank.org/ using the country name and indicator. The worldbank provides\n    mostly yearly data, and often has no data for the current year. Try offset=-1y if you get no data for recent\n    time ranges.',
  fn: function worldbankIndicators(args, tlConfig) {
    var config = _.defaults(args.byName, {
      country: 'wld',
      indicator: 'SP.POP.TOTL'
    });

    var countries = config.country.split(':');
    var seriesLists = _.map(countries, function (country) {
      var code = 'countries/' + country + '/indicators/' + config.indicator;
      var wbArgs = [code];
      wbArgs.byName = { code: code };
      return worldbank.timelionFn(wbArgs, tlConfig);
    });

    return Promise.map(seriesLists, function (seriesList) {
      return seriesList.list[0];
    }).then(function (list) {
      return {
        type: 'seriesList',
        list: list
      };
    });
  }
});
