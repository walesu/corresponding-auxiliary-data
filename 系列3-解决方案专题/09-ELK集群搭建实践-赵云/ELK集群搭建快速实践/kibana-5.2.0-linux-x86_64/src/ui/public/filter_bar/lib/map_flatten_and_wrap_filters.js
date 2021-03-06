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
import FilterBarLibMapAndFlattenFiltersProvider from 'ui/filter_bar/lib/map_and_flatten_filters';
export default function mapFlattenAndWrapFilters(Private) {
  let mapAndFlattenFilters = Private(FilterBarLibMapAndFlattenFiltersProvider);
  return function (filters) {
    return mapAndFlattenFilters(filters).then(function (filters) {
      return _.map(filters, function (filter) {
        filter.meta = filter.meta || {};
        filter.meta.apply = true;
        return filter;
      });
    });
  };
};
