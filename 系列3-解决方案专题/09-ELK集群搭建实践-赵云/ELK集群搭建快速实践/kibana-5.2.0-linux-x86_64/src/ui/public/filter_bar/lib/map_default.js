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

import angular from 'angular';
import _ from 'lodash';
export default function mapDefaultProvider(Promise) {

  let metaProperty = /(^\$|meta)/;

  return function (filter) {
    let key = _.find(_.keys(filter), function (key) {
      return !key.match(metaProperty);
    });

    if (key) {
      let value = angular.toJson(filter[key]);
      return Promise.resolve({ key: key, value: value });
    }
    return Promise.reject(filter);
  };
};
