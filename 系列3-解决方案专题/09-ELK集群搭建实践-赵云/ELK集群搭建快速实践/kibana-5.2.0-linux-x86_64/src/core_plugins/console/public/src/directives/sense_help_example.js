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

const SenseEditor = require('../sense_editor/editor');
const exampleText = require('raw!./helpExample.txt').trim();
import { useResizeCheckerProvider } from '../sense_editor_resize';

require('ui/modules')
.get('app/sense')
.directive('senseHelpExample', function (Private) {
  const useResizeChecker = Private(useResizeCheckerProvider);

  return {
    restrict: 'E',
    link: function ($scope, $el) {
      $el.text(exampleText);
      $scope.editor = new SenseEditor($el);
      useResizeChecker($scope, $el, $scope.editor);
      $scope.editor.setReadOnly(true);
      $scope.editor.$blockScrolling = Infinity;

      $scope.$on('$destroy', function () {
        if ($scope.editor) $scope.editor.destroy();
      });
    }
  }
})
