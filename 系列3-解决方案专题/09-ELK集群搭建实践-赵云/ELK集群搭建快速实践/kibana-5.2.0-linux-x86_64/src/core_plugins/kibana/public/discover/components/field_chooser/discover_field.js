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
import html from 'plugins/kibana/discover/components/field_chooser/discover_field.html';
import _ from 'lodash';
import 'ui/directives/css_truncate';
import 'ui/directives/field_name';
import detailsHtml from 'plugins/kibana/discover/components/field_chooser/lib/detail_views/string.html';
import uiModules from 'ui/modules';
const app = uiModules.get('apps/discover');



app.directive('discoverField', function ($compile) {
  return {
    restrict: 'E',
    template: html,
    replace: true,
    link: function ($scope, $elem) {
      let detailsElem;
      let detailScope = $scope.$new();


      const init = function () {
        if ($scope.field.details) {
          $scope.toggleDetails($scope.field, true);
        }
      };

      const getWarnings = function (field) {
        let warnings = [];

        if (!field.scripted) {
          if (!field.doc_values && field.type !== 'boolean' && !(field.analyzed && field.type === 'string')) {
            warnings.push('Doc values are not enabled on this field. This may lead to excess heap consumption when visualizing.');
          }

          if (field.analyzed && field.type === 'string') {
            warnings.push('This is an analyzed string field.' +
              ' Analyzed strings are highly unique and can use a lot of memory to visualize.' +
              ' Values such as foo-bar will be broken into foo and bar.');
          }

          if (!field.indexed) {
            warnings.push('This field is not indexed and might not be usable in visualizations.');
          }
        }


        if (field.scripted) {
          warnings.push('Scripted fields can take a long time to execute.');
        }

        if (warnings.length > 1) {
          warnings = warnings.map(function (warning, i) {
            return (i > 0 ? '\n' : '') + (i + 1) + ' - ' + warning;
          });
        }

        return warnings;

      };

      $scope.toggleDisplay = function (field) {
        // This is inherited from fieldChooser
        $scope.toggle(field.name);
        if (field.display) $scope.increaseFieldCounter(field);

        if (field.details) {
          $scope.toggleDetails(field);
        }
      };

      $scope.toggleDetails = function (field, recompute) {
        if (_.isUndefined(field.details) || recompute) {
          // This is inherited from fieldChooser
          $scope.details(field, recompute);
          detailScope.$destroy();
          detailScope = $scope.$new();
          detailScope.warnings = getWarnings(field);

          detailsElem = $(detailsHtml);
          $compile(detailsElem)(detailScope);
          $elem.append(detailsElem).addClass('active');
        } else {
          delete field.details;
          detailsElem.remove();
          $elem.removeClass('active');
        }
      };

      init();
    }
  };
});
