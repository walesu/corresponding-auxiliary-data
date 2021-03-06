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
export default function FlattenDataObjectUtilService() {

  /*
   * Accepts a Kibana data object, flattens the data.series values array,
   * and returns an array of values objects.
   */

  return function (obj) {
    let charts;

    if (!_.isObject(obj) || !obj.rows && !obj.columns && !obj.series) {
      throw new TypeError('FlattenDataObjUtilService expects an object with a series, rows, or columns key');
    }

    if (!obj.series) {
      charts = obj.rows ? obj.rows : obj.columns;
    }

    return _(charts ? charts : [obj])
    .pluck('series')
    .flattenDeep()
    .pluck('values')
    .flattenDeep()
    .filter(Boolean)
    .value();
  };
};
