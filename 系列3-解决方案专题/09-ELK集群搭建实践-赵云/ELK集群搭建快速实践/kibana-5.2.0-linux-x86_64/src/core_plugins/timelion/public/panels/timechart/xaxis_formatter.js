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

var moment = require('moment');

module.exports = function xaxisFormatterProvider(config, timefilter) {

  function getFormat(esInterval) {
    var parts = esInterval.match(/(\d+)(ms|s|m|h|d|w|M|y|)/);
    if (parts == null || parts[1] == null || parts[2] == null) throw new Error ('Unknown interval');

    var interval = moment.duration(Number(parts[1]), parts[2]);

    // Cribbed from Kibana's TimeBuckets class
    let rules = config.get('dateFormat:scaled');

    for (let i = rules.length - 1; i >= 0; i--) {
      let rule = rules[i];
      if (!rule[0] || interval >= moment.duration(rule[0])) {
        return rule[1];
      }
    }

    return config.get('dateFormat');
  };

  return function (esInterval) {
    return getFormat(esInterval);
  };
};
