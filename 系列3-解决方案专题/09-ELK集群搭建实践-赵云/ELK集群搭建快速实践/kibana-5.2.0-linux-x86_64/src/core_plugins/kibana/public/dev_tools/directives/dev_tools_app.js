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
import DevToolsRegistryProvider from 'ui/registry/dev_tools';
import template from 'plugins/kibana/dev_tools/partials/dev_tools_app.html';
import 'plugins/kibana/dev_tools/styles/dev_tools_app.less';
import 'ui/kbn_top_nav';

uiModules
.get('apps/dev_tools')
.directive('kbnDevToolsApp', function (Private, $location) {
  const devToolsRegistry = Private(DevToolsRegistryProvider);

  return {
    restrict: 'E',
    replace: true,
    template,
    transclude: true,
    scope: {
      topNavConfig: '='
    },
    bindToController: true,
    controllerAs: 'kbnDevToolsApp',
    controller() {
      this.devTools = devToolsRegistry.inOrder;
      this.currentPath = `#${$location.path()}`;
    }
  };
});
