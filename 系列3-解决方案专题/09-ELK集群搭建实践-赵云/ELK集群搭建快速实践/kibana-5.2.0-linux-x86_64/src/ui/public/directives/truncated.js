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

import $ from 'jquery';
import truncText from 'trunc-text';
import truncHTML from 'trunc-html';
import uiModules from 'ui/modules';
import truncatedTemplate from 'ui/directives/partials/truncated.html';
import 'angular-sanitize';

const module = uiModules.get('kibana', ['ngSanitize']);

module.directive('kbnTruncated', function ($compile) {
  return {
    restrict: 'E',
    scope: {
      source: '@',
      length: '@',
      isHtml: '@'
    },
    template: truncatedTemplate,
    link: function ($scope, $element, attrs) {
      const source = $scope.source;
      const max = $scope.length;
      const truncated = $scope.isHtml
        ? truncHTML(source, max).html
        : truncText(source, max);

      $scope.content = truncated;

      if (source === truncated) {
        return;
      }
      $scope.truncated = true;
      $scope.expanded = false;
      $scope.action = 'more';
      $scope.toggle = () => {
        $scope.expanded = !$scope.expanded;
        $scope.content = $scope.expanded ? source : truncated;
        $scope.action = $scope.expanded ? 'less' : 'more';
      };
    }
  };
});
