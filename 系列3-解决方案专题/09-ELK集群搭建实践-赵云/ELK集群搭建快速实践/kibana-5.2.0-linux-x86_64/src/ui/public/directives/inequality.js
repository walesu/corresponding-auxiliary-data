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

function makeDirectiveDef(id, compare) {
  return function ($parse) {
    return {
      require: 'ngModel',
      link: function ($scope, $el, $attr, ngModel) {
        let getBound = function () { return $parse($attr[id])(); };
        let defaultVal = {
          'greaterThan': -Infinity,
          'greaterOrEqualThan': -Infinity,
          'lessThan': Infinity
        }[id];

        ngModel.$parsers.push(validate);
        ngModel.$formatters.push(validate);

        $scope.$watch(getBound, function () {
          validate(ngModel.$viewValue);
        });

        function validate(val) {
          let bound = !isNaN(getBound()) ? +getBound() : defaultVal;
          let valid = !isNaN(bound) && !isNaN(val) && compare(val, bound);
          ngModel.$setValidity(id, valid);
          return val;
        }
      }
    };
  };
}

uiModules
  .get('kibana')
  .directive('greaterThan', makeDirectiveDef('greaterThan', function (a, b) {
    return a > b;
  }))
  .directive('lessThan', makeDirectiveDef('lessThan', function (a, b) {
    return a < b;
  }))
  .directive('greaterOrEqualThan', makeDirectiveDef('greaterOrEqualThan', function (a, b) {
    return a >= b;
  }));
