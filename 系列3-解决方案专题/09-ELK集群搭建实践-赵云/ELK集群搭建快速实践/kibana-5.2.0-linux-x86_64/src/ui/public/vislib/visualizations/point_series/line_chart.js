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
import _ from 'lodash';
import VislibVisualizationsPointSeriesProvider from './_point_series';
export default function LineChartFactory(Private) {

  const PointSeries = Private(VislibVisualizationsPointSeriesProvider);

  const defaults = {
    mode: 'normal',
    showCircles: true,
    radiusRatio: 9,
    showLines: true,
    interpolate: 'linear',
    color: undefined,
    fillColor: undefined
  };
  /**
   * Line Chart Visualization
   *
   * @class LineChart
   * @constructor
   * @extends Chart
   * @param handler {Object} Reference to the Handler Class Constructor
   * @param el {HTMLElement} HTML element to which the chart will be appended
   * @param chartData {Object} Elasticsearch query results for this specific chart
   */
  class LineChart extends PointSeries {
    constructor(handler, chartEl, chartData, seriesConfigArgs) {
      super(handler, chartEl, chartData, seriesConfigArgs);
      this.seriesConfig = _.defaults(seriesConfigArgs || {}, defaults);
    }

    addCircles(svg, data) {
      const self = this;
      const showCircles = this.seriesConfig.showCircles;
      const color = this.handler.data.getColorFunc();
      const xScale = this.getCategoryAxis().getScale();
      const yScale = this.getValueAxis().getScale();
      const ordered = this.handler.data.get('ordered');
      const tooltip = this.baseChart.tooltip;
      const isTooltip = this.handler.visConfig.get('tooltip.show');
      const isHorizontal = this.getCategoryAxis().axisConfig.isHorizontal();

      const radii =  this.baseChart.radii;

      const radiusStep = ((radii.max - radii.min) || (radii.max * 100)) / Math.pow(this.seriesConfig.radiusRatio, 2);

      const layer = svg.append('g')
        .attr('class', 'points line')
        .attr('clip-path', 'url(#' + this.baseChart.clipPathId + ')');

      const circles = layer
      .selectAll('circle')
      .data(function appendData() {
        return data.values.filter(function (d) {
          return !_.isNull(d.y);
        });
      });

      circles
      .exit()
      .remove();

      function cx(d) {
        if (ordered && ordered.date) {
          return xScale(d.x);
        }
        return xScale(d.x) + xScale.rangeBand() / 2;
      }

      function cy(d) {
        return yScale(d.y);
      }

      function cColor(d) {
        return color(d.series);
      }

      function colorCircle(d) {
        const parent = d3.select(this).node().parentNode;
        const lengthOfParent = d3.select(parent).data()[0].length;
        const isVisible = (lengthOfParent === 1);

        // If only 1 point exists, show circle
        if (!showCircles && !isVisible) return 'none';
        return cColor(d);
      }

      function getCircleRadiusFn(modifier) {
        return function getCircleRadius(d) {
          const margin = self.handler.visConfig.get('style.margin');
          const width = self.baseChart.chartConfig.width;
          const height = self.baseChart.chartConfig.height;
          const circleRadius = (d.z - radii.min) / radiusStep;

          return _.min([Math.sqrt((circleRadius || 2) + 2), width, height]) + (modifier || 0);
        };
      }

      circles
      .enter()
      .append('circle')
      .attr('r', getCircleRadiusFn())
      .attr('fill-opacity', (this.seriesConfig.drawLinesBetweenPoints ? 1 : 0.7))
      .attr('cx', isHorizontal ? cx : cy)
      .attr('cy', isHorizontal ? cy : cx)
      .attr('class', 'circle-decoration')
      .attr('data-label', data.label)
      .attr('fill', colorCircle);

      circles
      .enter()
      .append('circle')
      .attr('r', getCircleRadiusFn(10))
      .attr('cx', isHorizontal ? cx : cy)
      .attr('cy', isHorizontal ? cy : cx)
      .attr('fill', 'transparent')
      .attr('class', 'circle')
      .attr('data-label', data.label)
      .attr('stroke', cColor)
      .attr('stroke-width', 0);

      if (isTooltip) {
        circles.call(tooltip.render());
      }

      return circles;
    };

    /**
     * Adds path to SVG
     *
     * @method addLines
     * @param svg {HTMLElement} SVG to which path are appended
     * @param data {Array} Array of object data points
     * @returns {D3.UpdateSelection} SVG with paths added
     */
    addLine(svg, data) {
      const xScale = this.getCategoryAxis().getScale();
      const yScale = this.getValueAxis().getScale();
      const xAxisFormatter = this.handler.data.get('xAxisFormatter');
      const color = this.handler.data.getColorFunc();
      const ordered = this.handler.data.get('ordered');
      const interpolate = this.seriesConfig.interpolate;
      const isHorizontal = this.getCategoryAxis().axisConfig.isHorizontal();

      const line = svg.append('g')
      .attr('class', 'pathgroup lines')
      .attr('clip-path', 'url(#' + this.baseChart.clipPathId + ')');

      function cx(d) {
        if (ordered && ordered.date) {
          return xScale(d.x);
        }
        return xScale(d.x) + xScale.rangeBand() / 2;
      }

      function cy(d) {
        return yScale(d.y);
      }

      line.append('path')
      .attr('data-label', data.label)
      .attr('d', () => {
        const d3Line = d3.svg.line()
          .defined(function (d) {
            return !_.isNull(d.y);
          })
          .interpolate(interpolate)
          .x(isHorizontal ? cx : cy)
          .y(isHorizontal ? cy : cx);
        return d3Line(data.values);
      })
      .attr('fill', 'none')
      .attr('stroke', () => {
        return color(data.label);
      })
      .attr('stroke-width', 2);

      return line;
    };

    /**
     * Renders d3 visualization
     *
     * @method draw
     * @returns {Function} Creates the line chart
     */
    draw() {
      const self = this;

      return function (selection) {
        selection.each(function () {

          const svg = self.chartEl.append('g');
          svg.data([self.chartData]);

          if (self.seriesConfig.drawLinesBetweenPoints) {
            self.addLine(svg, self.chartData);
          }
          const circles = self.addCircles(svg, self.chartData);
          self.addCircleEvents(circles);

          self.events.emit('rendered', {
            chart: self.chartData
          });

          return svg;
        });
      };
    };
  }

  return LineChart;
};
