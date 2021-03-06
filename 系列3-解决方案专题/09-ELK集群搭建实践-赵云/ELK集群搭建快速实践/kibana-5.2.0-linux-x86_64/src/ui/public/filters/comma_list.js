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

uiModules
.get('kibana')
.filter('commaList', function () {
  /**
   * Angular filter that accepts either an array or a comma-seperated string
   * and outputs either an array, or a comma-seperated string for presentation.
   *
   * @param {String|Array} input - The comma-seperated list or array
   * @param {Boolean} inclusive - Should the list be joined with an "and"?
   * @return {String}
   */
  return function (input, inclusive) {
    let list = _.commaSeperatedList(input);
    if (list.length < 2) {
      return list.join('');
    }

    let conj = inclusive ? ' and ' : ' or ';
    return list.slice(0, -1).join(', ') + conj + _.last(list);

  };
});
