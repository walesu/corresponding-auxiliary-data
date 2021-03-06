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

var alter = require('../lib/alter.js');

var Chainable = require('../lib/classes/chainable');
module.exports = new Chainable('lines', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'width',
    types: ['number', 'null'],
    help: 'Line thickness'
  }, {
    name: 'fill',
    types: ['number', 'null'],
    help: 'Number between 0 and 10. Use for making area charts'
  }, {
    name: 'stack',
    types: ['boolean', 'null'],
    help: 'Stack lines, often misleading. At least use some fill if you use this.'
  }, {
    name: 'show',
    types: ['number', 'boolean', 'null'],
    help: 'Show or hide lines'
  }, {
    name: 'steps',
    types: ['number', 'boolean', 'null'],
    help: 'Show line as step, eg, do not interpolate between points'
  }],
  help: 'Show the seriesList as lines',
  fn: function linesFn(args) {
    return alter(args, function (eachSeries, width, fill, stack, show, steps) {
      eachSeries.lines = eachSeries.lines || {};

      // Defaults
      if (eachSeries.lines.lineWidth == null) eachSeries.lines.lineWidth = 3;

      if (width != null) eachSeries.lines.lineWidth = width;
      if (fill != null) eachSeries.lines.fill = fill / 10;
      if (stack != null) eachSeries.stack = stack;
      if (show != null) eachSeries.lines.show = show;
      if (steps != null) eachSeries.lines.steps = steps;

      return eachSeries;
    });
  }
});
