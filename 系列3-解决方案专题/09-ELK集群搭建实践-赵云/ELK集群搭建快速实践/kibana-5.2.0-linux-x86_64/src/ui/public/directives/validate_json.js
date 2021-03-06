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
import $ from 'jquery';
import uiModules from 'ui/modules';

let module = uiModules.get('kibana');

module.directive('validateJson', function ($compile) {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      'ngModel': '=',
      'queryInput': '=?',
    },
    link: function ($scope, $elem, attr, ngModel) {
      $scope.$watch('ngModel', validator);

      function validator(newValue, oldValue) {
        if (!newValue || newValue.length === 0) {
          setValid();
          return;
        }

        // We actually need a proper object in all JSON inputs
        newValue = (newValue || '').trim();
        if (newValue[0] === '{' || '[') {
          try {
            JSON.parse(newValue);
            setValid();
          } catch (e) {
            setInvalid();
          }
        } else {
          setInvalid();
        }
      }

      function setValid() {
        ngModel.$setValidity('jsonInput', true);
      }

      function setInvalid() {
        ngModel.$setValidity('jsonInput', false);
      }
    }
  };
});
