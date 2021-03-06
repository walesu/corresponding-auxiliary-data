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

import uiModules from 'ui/modules';
import heatmapOptionsTemplate from 'plugins/kbn_vislib_vis_types/controls/heatmap_options.html';
import _ from 'lodash';
const module = uiModules.get('kibana');

module.directive('heatmapOptions', function () {
  return {
    restrict: 'E',
    template: heatmapOptionsTemplate,
    replace: true,
    link: function ($scope) {
      $scope.showColorRange = false;
      $scope.showLabels = false;
      $scope.customColors = false;
      $scope.options = {
        rotateLabels: false
      };

      $scope.valueAxis = $scope.vis.params.valueAxes[0];

      $scope.$watch('options.rotateLabels', rotate => {
        $scope.vis.params.valueAxes[0].labels.rotate = rotate ? 270 : 0;
      });

      $scope.resetColors = function () {
        $scope.uiState.set('vis.colors', null);
        $scope.customColors = false;
      };

      $scope.toggleColorRangeSection = function (checkbox = false) {
        $scope.showColorRange = !$scope.showColorRange;
        if (checkbox && !$scope.vis.params.setColorRange) $scope.showColorRange = false;
        if (!checkbox && $scope.showColorRange && !$scope.vis.params.setColorRange) $scope.vis.params.setColorRange = true;
      };

      $scope.toggleLabelSection = function (checkbox = false) {
        $scope.showLabels = !$scope.showLabels;
        if (checkbox && !$scope.valueAxis.labels.show) $scope.showLabels = false;
        if ($scope.showLabels && !$scope.valueAxis.labels.show) $scope.valueAxis.labels.show = true;
      };

      $scope.getGreaterThan = function (index) {
        if (index === 0) return;
        return $scope.vis.params.colorsRange[index - 1].to;
      };

      $scope.addRange = function () {
        const previousRange = _.last($scope.vis.params.colorsRange);
        const from = previousRange ? previousRange.to : 0;
        $scope.vis.params.colorsRange.push({ from: from, to: null });
      };

      $scope.removeRange = function (index) {
        $scope.vis.params.colorsRange.splice(index, 1);
      };

      $scope.getColor = function (index) {
        const defaultColors = this.uiState.get('vis.defaultColors');
        const overwriteColors = this.uiState.get('vis.colors');
        const colors = defaultColors ? _.defaults({}, overwriteColors, defaultColors) : overwriteColors;
        return colors ? Object.values(colors)[index] : 'transparent';
      };

      $scope.uiState.on('colorChanged', () => {
        $scope.customColors = true;
      });
    }
  };
});
