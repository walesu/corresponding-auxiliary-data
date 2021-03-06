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

import d3 from 'd3';
/**
 * Creates a string based on the hex color passed in
 *
 * @method dataLabel
 * @param d {Object} object to wrap in d3.select
 * @returns {string} label value
 */
function dataLabel(selection, label) {
  d3.select(selection).attr('data-label', label);
}

export default dataLabel;
