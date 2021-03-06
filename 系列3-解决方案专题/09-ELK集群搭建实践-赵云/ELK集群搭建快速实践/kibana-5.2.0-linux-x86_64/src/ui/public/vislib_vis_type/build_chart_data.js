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

import AggResponseIndexProvider from 'ui/agg_response/index';
import AggResponseTabifyTableProvider from 'ui/agg_response/tabify/_table';

export default function VislibVisBuildChartData(Private) {
  let aggResponse = Private(AggResponseIndexProvider);
  let Table = Private(AggResponseTabifyTableProvider);

  return function (esResponse) {
    let vis = this.vis;

    if (vis.isHierarchical()) {
      // the hierarchical converter is very self-contained (woot!)
      return aggResponse.hierarchical(vis, esResponse);
    }

    let tableGroup = aggResponse.tabify(vis, esResponse, {
      canSplit: true,
      asAggConfigResults: true
    });

    let converted = convertTableGroup(vis, tableGroup);
    if (!converted) {
      // mimic a row of tables that doesn't have any tables
      // https://github.com/elastic/kibana/blob/7bfb68cd24ed42b1b257682f93c50cd8d73e2520/src/kibana/components/vislib/components/zero_injection/inject_zeros.js#L32
      converted = { rows: [] };
    }

    converted.hits = esResponse.hits.total;

    return converted;
  };

  function convertTableGroup(vis, tableGroup) {
    let tables = tableGroup.tables;
    let firstChild = tables[0];
    if (firstChild instanceof Table) {

      let chart = convertTable(vis, firstChild);
      // if chart is within a split, assign group title to its label
      if (tableGroup.$parent) {
        chart.label = tableGroup.title;
      }
      return chart;
    }

    if (!tables.length) return;
    let out = {};
    let outList;

    tables.forEach(function (table) {
      if (!outList) {
        let aggConfig = table.aggConfig;
        let direction = aggConfig.params.row ? 'rows' : 'columns';
        outList = out[direction] = [];
      }

      let output;
      if (output = convertTableGroup(vis, table)) {
        outList.push(output);
      }
    });

    return out;
  }

  function convertTable(vis, table) {
    return vis.type.responseConverter(vis, table);
  }
};
