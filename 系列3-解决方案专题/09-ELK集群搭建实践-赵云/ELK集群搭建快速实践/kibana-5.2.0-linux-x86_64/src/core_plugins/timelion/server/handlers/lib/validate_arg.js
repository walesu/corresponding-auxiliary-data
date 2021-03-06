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

var argType = require('./arg_type');
var _ = require('lodash');

module.exports = function (functionDef) {
  return function validateArg(value, name, argDef) {
    var type = argType(value);
    var required = argDef.types;
    var multi = argDef.multi;
    var isCorrectType = (function () {
      // If argument is not allow to be specified multiple times, we're dealing with a plain value for type
      if (!multi) return _.contains(required, type);
      // If it is, we'll get an array for type
      return _.difference(type, required).length === 0;
    })();

    if (isCorrectType) return true;else return false;

    if (!isCorrectType) {
      throw new Error(functionDef.name + '(' + name + ') must be one of ' + JSON.stringify(required) + '. Got: ' + type);
    }
  };
};
