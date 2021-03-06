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
import VislibProvider from 'ui/vislib';
import VisRenderbotProvider from 'ui/vis/renderbot';
import VislibVisTypeBuildChartDataProvider from 'ui/vislib_vis_type/build_chart_data';
module.exports = function VislibRenderbotFactory(Private, $injector) {
  const AngularPromise = $injector.get('Promise');
  let vislib = Private(VislibProvider);
  let Renderbot = Private(VisRenderbotProvider);
  let buildChartData = Private(VislibVisTypeBuildChartDataProvider);

  _.class(VislibRenderbot).inherits(Renderbot);
  function VislibRenderbot(vis, $el, uiState) {
    VislibRenderbot.Super.call(this, vis, $el, uiState);
    this.refreshLegend = 0;
    this._createVis();
  }

  VislibRenderbot.prototype._createVis = function () {
    if (this.vislibVis) this.destroy();

    this.vislibParams = this._getVislibParams();
    this.vislibVis = new vislib.Vis(this.$el[0], this.vislibParams);

    _.each(this.vis.listeners, (listener, event) => {
      this.vislibVis.on(event, listener);
    });

    if (this.chartData) {
      this.vislibVis.render(this.chartData, this.uiState);
      this.refreshLegend++;
    }
  };

  VislibRenderbot.prototype._getVislibParams = function () {
    let self = this;

    return _.assign(
      {},
      self.vis.type.params.defaults,
      {
        type: self.vis.type.name,
        // Add attribute which determines whether an index is time based or not.
        hasTimeField: self.vis.indexPattern && self.vis.indexPattern.hasTimeField()
      },
      self.vis.params
    );
  };

  VislibRenderbot.prototype.buildChartData = buildChartData;
  VislibRenderbot.prototype.render = function (esResponse) {
    this.chartData = this.buildChartData(esResponse);
    return AngularPromise.delay(1).then(() => {
      this.vislibVis.render(this.chartData, this.uiState);
      this.refreshLegend++;
    });
  };

  VislibRenderbot.prototype.destroy = function () {
    let self = this;

    let vislibVis = self.vislibVis;

    _.forOwn(self.vis.listeners, function (listener, event) {
      vislibVis.off(event, listener);
    });

    vislibVis.destroy();
  };

  VislibRenderbot.prototype.updateParams = function () {
    let self = this;

    // get full vislib params object
    let newParams = self._getVislibParams();

    // if there's been a change, replace the vis
    if (!_.isEqual(newParams, self.vislibParams)) self._createVis();
  };

  return VislibRenderbot;
};
