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
export default function buildPhraseFilter(field, value, indexPattern) {
  let filter = { meta: { index: indexPattern.id} };

  if (field.scripted) {
    // See https://github.com/elastic/elasticsearch/issues/20941 and https://github.com/elastic/kibana/issues/8677
    // and https://github.com/elastic/elasticsearch/pull/22201
    // for the reason behind this change. Aggs now return boolean buckets with a key of 1 or 0.
    let convertedValue = value;
    if (typeof value !== 'boolean' && field.type === 'boolean') {
      if (value !== 1 && value !== 0) {
        throw new Error('Boolean scripted fields must return true or false');
      }
      convertedValue = value === 1 ? true : false;
    }

    const script = buildInlineScriptForPhraseFilter(field);

    _.set(filter, 'script.script', {
      inline: script,
      lang: field.lang,
      params: {
        value: convertedValue
      }
    });
    filter.meta.field = field.name;
  } else {
    filter.query = { match: {} };
    filter.query.match[field.name] = {
      query: value,
      type: 'phrase'
    };
  }
  return filter;
};


/**
 * Takes a scripted field and returns an inline script appropriate for use in a script query.
 * Handles lucene expression and Painless scripts. Other langs aren't guaranteed to generate valid
 * scripts.
 *
 * @param {object} scriptedField A Field object representing a scripted field
 * @returns {string} The inline script string
 */
export function buildInlineScriptForPhraseFilter(scriptedField) {
  // We must wrap painless scripts in a lambda in case they're more than a simple expression
  if (scriptedField.lang === 'painless') {
    return `boolean compare(Supplier s, def v) {return s.get() == v;}` +
           `compare(() -> { ${scriptedField.script} }, params.value);`;
  }
  else {
    return `(${scriptedField.script}) == value`;
  }
}
