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
import AggTypesAggTypeProvider from 'ui/agg_types/agg_type';
import RegistryFieldFormatsProvider from 'ui/registry/field_formats';
export default function MetricAggTypeProvider(Private) {
  let AggType = Private(AggTypesAggTypeProvider);
  let fieldFormats = Private(RegistryFieldFormatsProvider);

  _.class(MetricAggType).inherits(AggType);
  function MetricAggType(config) {
    MetricAggType.Super.call(this, config);

    // allow overriding any value on the prototype
    _.forOwn(config, function (val, key) {
      if (_.has(MetricAggType.prototype, key)) {
        this[key] = val;
      }
    }, this);
  }

  /**
   * Read the values for this metric from the
   * @param  {[type]} bucket [description]
   * @return {*}        [description]
   */
  MetricAggType.prototype.getValue = function (agg, bucket) {
    // Metric types where an empty set equals `zero`
    let isSettableToZero = ['cardinality', 'sum'].indexOf(agg.__type.name) !== -1;

    // Return proper values when no buckets are present
    // `Count` handles empty sets properly
    if (!bucket[agg.id] && isSettableToZero) return 0;

    return bucket[agg.id] && bucket[agg.id].value;
  };

  /**
   * Pick a format for the values produced by this agg type,
   * overriden by several metrics that always output a simple
   * number
   *
   * @param  {agg} agg - the agg to pick a format for
   * @return {FieldFromat}
   */
  MetricAggType.prototype.getFormat = function (agg) {
    let field = agg.getField();
    return field ? field.format : fieldFormats.getDefaultInstance('number');
  };

  return MetricAggType;
};
