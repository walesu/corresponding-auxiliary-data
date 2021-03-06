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

import modules from 'ui/modules';
import angular from 'angular';

function Storage(store) {
  let self = this;
  self.store = store;

  self.get = function (key) {
    try {
      return JSON.parse(self.store.getItem(key));
    } catch (e) {
      return null;
    }
  };

  self.set = function (key, value) {
    try {
      return self.store.setItem(key, angular.toJson(value));
    } catch (e) {
      return false;
    }
  };

  self.remove = function (key) {
    return self.store.removeItem(key);
  };

  self.clear = function () {
    return self.store.clear();
  };
}

let createService = function (type) {
  return function ($window) {
    return new Storage($window[type]);
  };
};

modules.get('kibana/storage')
  .service('localStorage', createService('localStorage'))
  .service('sessionStorage', createService('sessionStorage'));
