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
import AggResponsePointSeriesGetPointProvider from 'ui/agg_response/point_series/_get_point';
import AggResponsePointSeriesAddToSiriProvider from 'ui/agg_response/point_series/_add_to_siri';
export default function PointSeriesGetSeries(Private) {
  let getPoint = Private(AggResponsePointSeriesGetPointProvider);
  let addToSiri = Private(AggResponsePointSeriesAddToSiriProvider);

  return function getSeries(rows, chart) {
    let aspects = chart.aspects;
    let multiY = _.isArray(aspects.y);
    let yScale = chart.yScale;
    let partGetPoint = _.partial(getPoint, aspects.x, aspects.series, yScale);

    let series = _(rows)
    .transform(function (series, row) {
      if (!multiY) {
        let point = partGetPoint(row, aspects.y, aspects.z);
        if (point) addToSiri(series, point, point.series);
        return;
      }

      aspects.y.forEach(function (y) {
        let point = partGetPoint(row, y, aspects.z);
        if (!point) return;

        // use the point's y-axis as it's series by default,
        // but augment that with series aspect if it's actually
        // available
        let seriesId = y.agg.id;
        let seriesLabel = y.col.title;

        if (aspects.series) {
          const prefix = point.series ? point.series + ': ' : '';
          seriesId = prefix + seriesId;
          seriesLabel = prefix + seriesLabel;
        }

        addToSiri(series, point, seriesId, seriesLabel);
      });

    }, new Map())
    .thru(series => [...series.values()])
    .value();

    if (multiY) {
      series = _.sortBy(series, function (siri) {
        let firstVal = siri.values[0];
        let y;

        if (firstVal) {
          let agg = firstVal.aggConfigResult.aggConfig;
          y = _.find(aspects.y, function (y) {
            return y.agg === agg;
          });
        }

        return y ? y.i : series.length;
      });
    }

    return series;
  };
};
