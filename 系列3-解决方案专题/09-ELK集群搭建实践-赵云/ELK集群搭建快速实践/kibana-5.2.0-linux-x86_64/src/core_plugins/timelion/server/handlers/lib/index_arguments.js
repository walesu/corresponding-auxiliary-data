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

// Only applies to already resolved arguments
module.exports = function indexArguments(functionDef, orderedArgs) {

  var validateArg = require('./validate_arg')(functionDef);

  // This almost certainly is not required
  var allowedLength = functionDef.extended ? functionDef.args.length + 2 : functionDef.args.length;
  if (orderedArgs.length > allowedLength) throw new Error('Too many arguments passed to: ' + functionDef.name);

  var indexedArgs = {};
  // Check and index each known argument
  _.each(functionDef.args, function (argDef, i) {
    var value = orderedArgs[i];
    validateArg(value, argDef.name, argDef);
    indexedArgs[argDef.name] = value;
  });

  // Also check and index the extended arguments if enabled
  if (functionDef.extended) {
    var values = orderedArgs[orderedArgs.length - 1];
    var names = orderedArgs[orderedArgs.length - 2];
    _.each(values, function (value, i) {
      validateArg(value, names[i], functionDef.extended);
      indexedArgs[names[i]] = value;
    });
  }

  return indexedArgs;
};
