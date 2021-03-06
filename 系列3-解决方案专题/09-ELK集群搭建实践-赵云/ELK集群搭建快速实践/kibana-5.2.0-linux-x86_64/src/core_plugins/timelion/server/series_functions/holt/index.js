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
var Chainable = require('../../lib/classes/chainable');
var ses = require('./lib/ses');
var des = require('./lib/des');
var tes = require('./lib/tes');
var toMilliseconds = require('../../lib/to_milliseconds');

module.exports = new Chainable('holt', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'alpha',
    types: ['number'],
    help: '\n        Smoothing weight from 0 to 1.\n        Increasing alpha will make the new series more closely follow the original.\n        Lowering it will make the series smoother'
  }, {
    name: 'beta',
    types: ['number'],
    help: '\n        Trending weight from 0 to 1.\n        Increasing beta will make rising/falling lines continue to rise/fall longer.\n        Lowering it will make the function learn the new trend faster'
  }, {
    name: 'gamma',
    types: ['number'],
    help: '\n        Seasonal weight from 0 to 1. Does your data look like a wave?\n        Increasing this will give recent seasons more importance, thus changing the wave form faster.\n        Lowering it will reduce the importance of new seasons, making history more important.\n        '
  }, {
    name: 'season',
    types: ['string'],
    help: 'How long is the season, eg, 1w if you pattern repeats weekly. (Only useful with gamma)'
  }, {
    name: 'sample',
    types: ['number', 'null'],
    help: '\n      The number of seasons to sample before starting to "predict" in a seasonal series.\n      (Only useful with gamma, Default: all)'
  }],
  help: '\n    Sample the beginning of a series and use it to forecast what should happen\n    via several optional parameters. In general, like everything, this is crappy at predicting the\n    future. You\'re much better off using it to predict what should be happening right now, for the\n    purpose of anomaly detection. Note that nulls will be filled with forecasted values. Deal with it.',
  fn: function expsmoothFn(args, tlConfig) {

    var newSeries = _.cloneDeep(args.byName.inputSeries);

    var alpha = args.byName.alpha;
    var beta = args.byName.beta;
    var gamma = args.byName.gamma;

    _.each(newSeries.list, function (series) {
      var sample = args.byName.sample || series.data.length; // If we use length it should simply never predict

      // Single exponential smoothing
      // This is basically a weighted moving average in which the older
      // points exponentially degrade relative to the alpha, eg:
      // 0.8^1, 0.8^2, 0.8^3, etc

      var times = _.map(series.data, 0);
      var points = _.map(series.data, 1);

      if (alpha != null && beta == null && gamma == null) {
        points = ses(points, alpha);
      }

      if (alpha != null && beta != null && gamma == null) {
        points = des(points, alpha, beta);
      }

      if (alpha != null && beta != null && gamma != null) {
        if (!sample || !args.byName.season || sample < 2) {
          throw new Error('Must specificy a season length and a sample size >= 2');
        }
        var season = Math.round(toMilliseconds(args.byName.season) / toMilliseconds(tlConfig.time.interval));
        points = tes(points, alpha, beta, gamma, season, sample);
      }

      _.assign(series.data, _.zip(times, points));
    });

    return newSeries;
  }
});
