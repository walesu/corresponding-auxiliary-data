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

import CidrMask from 'ui/utils/cidr_mask';
import buildRangeFilter from 'ui/filter_manager/lib/range';
export default function createIpRangeFilterProvider() {
  return function (aggConfig, key) {
    let range;
    if (aggConfig.params.ipRangeType === 'mask') {
      range = new CidrMask(key).getRange();
    } else {
      let [from, to] = key.split(/\s+to\s+/);
      range = {
        from: from === '-Infinity' ? -Infinity : from,
        to: to === 'Infinity' ? Infinity : to
      };
    }

    return buildRangeFilter(aggConfig.params.field, {gte: range.from, lte: range.to}, aggConfig.vis.indexPattern);
  };
};
