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

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.versionSatisfies = versionSatisfies;
exports.cleanVersion = cleanVersion;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

function versionSatisfies(cleanActual, cleanExpected) {
  try {
    return cleanActual === cleanExpected;
  } catch (err) {
    return false;
  }
}

function cleanVersion(version) {
  var match = version.match(/\d+\.\d+\.\d+/);
  if (!match) return version;
  return match[0];
}
