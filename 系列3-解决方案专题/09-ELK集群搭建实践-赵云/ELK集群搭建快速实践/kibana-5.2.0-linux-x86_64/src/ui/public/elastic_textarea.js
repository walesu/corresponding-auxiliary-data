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
import uiModules from 'ui/modules';
const NL_RE = /\n/g;
const events = 'keydown keypress keyup change';

uiModules.get('kibana')
.directive('elasticTextarea', function () {
  return {
    restrict: 'A',
    link: function ($scope, $el) {

      function resize() {
        $el.attr('rows', _.size($el.val().match(NL_RE)) + 1);
      }

      $el.on(events, resize);
      $scope.$evalAsync(resize);
      $scope.$on('$destroy', function () {
        $el.off(events, resize);
      });

    }
  };

});
