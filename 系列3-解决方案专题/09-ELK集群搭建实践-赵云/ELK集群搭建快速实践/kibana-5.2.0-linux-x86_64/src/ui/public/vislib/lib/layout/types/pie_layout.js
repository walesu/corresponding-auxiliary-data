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

import VislibLibLayoutSplitsPieChartChartSplitProvider from '../splits/pie_chart/chart_split';
import VislibLibLayoutSplitsPieChartChartTitleSplitProvider from '../splits/pie_chart/chart_title_split';
export default function ColumnLayoutFactory(Private) {
  const chartSplit = Private(VislibLibLayoutSplitsPieChartChartSplitProvider);
  const chartTitleSplit = Private(VislibLibLayoutSplitsPieChartChartTitleSplitProvider);

  /**
   * Specifies the visualization layout for column charts.
   *
   * This is done using an array of objects. The first object has
   * a `parent` DOM element,  a DOM `type` (e.g. div, svg, etc),
   * and a `class` (required). Each child can omit the parent object,
   * but must include a type and class.
   *
   * Optionally, you can specify `datum` to be bound to the DOM
   * element, a `splits` function that divides the selected element
   * into more DOM elements based on a callback function provided, or
   * a children array which nests other layout objects.
   *
   * Objects in children arrays are children of the current object and return
   * DOM elements which are children of their respective parent element.
   */

  return function (el, data) {
    if (!el || !data) {
      throw new Error('Both an el and data need to be specified');
    }

    return [
      {
        parent: el,
        type: 'div',
        class: 'vis-wrapper',
        datum: data,
        children: [
          {
            type: 'div',
            class: 'y-axis-chart-title',
            splits: chartTitleSplit
          },
          {
            type: 'div',
            class: 'vis-col-wrapper',
            children: [
              {
                type: 'div',
                class: 'chart-wrapper',
                splits: chartSplit
              },
              {
                type: 'div',
                class: 'x-axis-chart-title',
                splits: chartTitleSplit
              }
            ]
          }
        ]
      }
    ];
  };
};
