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

require('ui/directives/input_focus');

require('ui/modules')
.get('app/sense')
.directive('senseSettings', function () {
  return {
    restrict: 'E',
    template: require('./settings.html'),
    controllerAs: 'settings',
    controller: function ($scope, $element) {
      const settings = require('../settings');

      this.vals = settings.getCurrentSettings();
      this.apply = () => {
        this.vals = settings.updateSettings(this.vals);
        $scope.kbnTopNav.close();
      };

      const self = this;

      function onEnter(event) {
        if (event.which === 13) {
          self.apply();
        }
      }

      const boundElement = $element.bind('keydown', onEnter);
      $scope.$on('$destroy', () => boundElement.unbind('keydown', onEnter));
    },
  };
});
