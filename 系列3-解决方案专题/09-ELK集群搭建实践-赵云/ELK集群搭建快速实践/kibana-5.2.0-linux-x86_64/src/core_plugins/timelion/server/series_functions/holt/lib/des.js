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

module.exports = function des(points, alpha, beta) {
  var level;
  var prevLevel;
  var trend;
  var prevTrend;
  var value;
  var origin;
  var unknownCount = 0;

  if (points.length < 2) {
    throw new Error('You need at least 2 points to use double exponential smoothing');
  }

  var smoothedPoints = _.map(points, function (point, i) {
    if (i === 0) {
      return point;
    }

    if (i === 1) {
      // Establish initial values for level and trend;
      level = points[0];
      trend = points[1] - points[0]; // This is sort of a lame way to do this
    }

    if (point == null) {
      unknownCount++;
    } else {
      unknownCount = 0;
      // These 2 variables are not required, but are used for clarity.
      prevLevel = level;
      prevTrend = trend;
      level = alpha * point + (1 - alpha) * (prevLevel + prevTrend);
      trend = beta * (level - prevLevel) + (1 - beta) * prevTrend;
    }

    return level + unknownCount * trend;
  }, []);

  return smoothedPoints;
};
