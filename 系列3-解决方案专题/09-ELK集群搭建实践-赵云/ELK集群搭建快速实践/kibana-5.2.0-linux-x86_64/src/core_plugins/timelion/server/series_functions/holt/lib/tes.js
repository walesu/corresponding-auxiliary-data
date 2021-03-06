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

// Frequency = number of points per season
// Season = 1 hump

/*
Hourly data might have:
 - Daily seasonality (frequency=24)
 - Weekly seasonality (frequency=24×7=168)
 - Annual seasonality (frequency=24×365.25=8766)
*/

'use strict';

var _ = require('lodash');

// Uh, I don't think this will work when you have nulls in the initial seasonal components
function initSeasonalComponents(samplePoints, seasonLength) {
  var sampledSeasonCount = samplePoints.length / seasonLength;
  var currentSeason = [];
  var seasonalAverages = _.reduce(samplePoints, function (result, point, i) {
    currentSeason.push(point);
    // If this is the end of the season, add it to the result;
    if (i % seasonLength === seasonLength - 1) {
      result.push(_.sum(currentSeason) / seasonLength);
      currentSeason = [];
    }

    return result;
  }, []);

  var seasonals = _.times(seasonLength, function (i) {
    var sumOfValsOverAvg = 0;
    _.times(sampledSeasonCount, function (j) {
      sumOfValsOverAvg += samplePoints[seasonLength * j + i] - seasonalAverages[j];
    });

    return sumOfValsOverAvg / sampledSeasonCount;
  });

  return seasonals;
};

// This is different from the DES method of establishing trend because it looks for
// the difference in points between seasons
function initTrend(samplePoints, seasonLength) {
  var sum = 0;
  _.times(seasonLength, function (i) {
    sum += (samplePoints[i + seasonLength] - samplePoints[i]) / seasonLength;
  });
  return sum / seasonLength;
}

module.exports = function tes(points, alpha, beta, gamma, seasonLength, seasonsToSample) {

  var samplePoints = points.slice(0, seasonLength * seasonsToSample);
  var seasonals = initSeasonalComponents(samplePoints, seasonLength);
  var level;
  var prevLevel;
  var trend;
  var prevTrend;
  var unknownCount = 0;

  var result = _.map(points, function (point, i) {
    var seasonalPosition = i % seasonLength;
    // For the first samplePoints.length we use the actual points
    // After that we switch to the forecast
    if (i === 0) {
      trend = initTrend(points, seasonLength);
      level = points[0];
      return points[0];
    }

    // Beta isn't actually used once we're forecasting?
    if (point == null || i >= samplePoints.length) {
      unknownCount++;
      // Don't know this point, make it up!
      return level + unknownCount * trend + seasonals[seasonalPosition];
    } else {
      unknownCount = 0;
      // These 2 variables are not required, but are used for clarity.
      prevLevel = level;
      prevTrend = trend;
      level = alpha * (point - seasonals[seasonalPosition]) + (1 - alpha) * (prevLevel + prevTrend);
      trend = beta * (level - prevLevel) + (1 - beta) * prevTrend;
      seasonals[seasonalPosition] = gamma * (point - level) + (1 - gamma) * seasonals[seasonalPosition];
      return level + trend + seasonals[seasonalPosition];
    }
  });

  return result;
};
