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

import _ from 'lodash';
import uiModules from 'ui/modules';
// Gets all fields of a given type.
// You may also pass "*" to get all types
// Or an array of types to get all fields of that type

uiModules
.get('kibana')
.filter('matchAny', function () {
  return function (items, rules) {
    if (!_.isArray(rules)) {
      rules = [rules];
    }

    return _.filter(items, function (item) {
      for (let i = 0; i < rules.length; i++) {
        if (_.some([item], rules[i])) {
          return true;
        }
      }

      return false;
    });
  };
});
