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

function getFieldValues(hits, field) {
  const name = field.name;
  const flattenHit = field.indexPattern.flattenHit;
  return _.map(hits, function (hit) {
    return flattenHit(hit)[name];
  });
}

function getFieldValueCounts(params) {
  params = _.defaults(params, {
    count: 5,
    grouped: false
  });

  if (
    params.field.type === 'geo_point'
    || params.field.type === 'geo_shape'
    || params.field.type === 'attachment'
  ) {
    return { error: 'Analysis is not available for geo fields.' };
  }

  const allValues = getFieldValues(params.hits, params.field);
  let counts;
  const missing = _countMissing(allValues);

  try {
    const groups = _groupValues(allValues, params);
    counts = _.map(
      _.sortBy(groups, 'count').reverse().slice(0, params.count),
      function (bucket) {
        return {
          value: bucket.value,
          count: bucket.count,
          percent: (bucket.count / (params.hits.length - missing) * 100).toFixed(1)
        };
      });

    if (params.hits.length - missing === 0) {
      return {
        error: 'This field is present in your elasticsearch mapping' +
          ' but not in any documents in the search results.' +
          ' You may still be able to visualize or search on it.'
      };
    }

    return {
      total: params.hits.length,
      exists: params.hits.length - missing,
      missing: missing,
      buckets: counts,
    };
  } catch (e) {
    return { error: e.message };
  }

}

// returns a count of fields in the array that are undefined or null
function _countMissing(array) {
  return array.length - _.without(array, undefined, null).length;
}


function _groupValues(allValues, params) {
  const groups = {};
  let k;

  allValues.forEach(function (value) {
    if (_.isObject(value) && !_.isArray(value)) {
      throw new Error('Analysis is not available for object fields');
    }

    if (_.isArray(value) && !params.grouped) {
      k = value;
    } else {
      k = value == null ? undefined : [value];
    }

    _.each(k, function (key) {
      if (_.has(groups, key)) {
        groups[key].count++;
      } else {
        groups[key] = {
          value: (params.grouped ? value : key),
          count: 1
        };
      }
    });
  });

  return groups;
}

export default {
  _groupValues: _groupValues,
  _countMissing: _countMissing,
  getFieldValues: getFieldValues,
  getFieldValueCounts: getFieldValueCounts
};
