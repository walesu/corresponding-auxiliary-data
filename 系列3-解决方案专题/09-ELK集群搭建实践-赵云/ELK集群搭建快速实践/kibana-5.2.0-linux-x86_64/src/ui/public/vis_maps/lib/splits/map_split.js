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
define(function () {
  return function ChartSplitFactory() {

    /*
     * Adds div DOM elements to the `.chart-wrapper` element based on the data layout.
     * For example, if the data has rows, it returns the same number of
     * `.chart` elements as row objects.
     */
    return function split(selection) {
      selection.each(function (data) {
        const div = d3.select(this)
          .attr('class', function () {
            // Determine the parent class
            if (data.rows) {
              return 'chart-wrapper-row';
            } else if (data.columns) {
              return 'chart-wrapper-column';
            } else {
              return 'chart-wrapper';
            }
          });
        let divClass;

        const charts = div.selectAll('charts')
          .append('div')
          .data(function (d) {
            // Determine the child class
            if (d.rows) {
              divClass = 'chart-row';
              return d.rows;
            } else if (d.columns) {
              divClass = 'chart-column';
              return d.columns;
            } else {
              divClass = 'chart';
              return [d];
            }
          })
          .enter()
          .append('div')
          .attr('class', function () {
            return divClass;
          });

        if (!data.geoJson) {
          charts.call(split);
        }
      });
    };
  };
});
