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
var Promise = require('bluebird');

/**
 * Reduces multiple arrays into a single array using a function
 * @param {Array} args - args[0] must always be a {type: 'seriesList'}
 *
 * - If only arg[0] exists, the seriesList will be reduced to a seriesList containing a single series
 * - If multiple arguments are passed, each argument will be mapped onto each series in the seriesList.

 * @params {Function} fn - Function used to combine points at same index in each array of each series in the seriesList.
 * @return {seriesList}
 */
module.exports = function reduce(args, fn) {
  return Promise.all(args).then(function (args) {

    var seriesList = args.shift();
    var argument = args.shift();

    if (seriesList.type !== 'seriesList') {
      throw new Error('input must be a seriesList');
    }

    if (_.isObject(argument) && argument.type === 'seriesList') {
      if (argument.list.length !== 1) {
        throw new Error('argument must be a seriesList with a single series');
      } else {
        argument = argument.list[0];
      }
    }

    function reduceSeries(series) {
      return _.reduce(series, function (destinationObject, argument, i, p) {

        var output = _.map(destinationObject.data, function (point, index) {

          var value = point[1];

          if (value == null) {
            return [point[0], null];
          }

          if (_.isNumber(argument)) {
            return [point[0], fn(value, argument, i, p)];
          }

          if (argument.data[index] == null || argument.data[index][1] == null) {
            return [point[0], null];
          }
          return [point[0], fn(value, argument.data[index][1], i, p)];
        });

        // Output = single series

        output = {
          data: output
        };
        output = _.defaults(output, destinationObject);
        return output;
      });
    }

    var reduced;

    if (argument != null) {
      reduced = _.map(seriesList.list, function (series) {
        return reduceSeries([series].concat(argument));
      });
    } else {
      reduced = [reduceSeries(seriesList.list)];
    }

    seriesList.list = reduced;
    return seriesList;
  })['catch'](function (e) {
    throw e;
  });
};
