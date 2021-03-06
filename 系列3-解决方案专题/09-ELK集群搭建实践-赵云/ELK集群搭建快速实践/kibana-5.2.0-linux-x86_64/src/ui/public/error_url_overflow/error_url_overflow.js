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

import uiRoutes from 'ui/routes';
import uiModules from 'ui/modules';
import KbnUrlProvider from 'ui/url';

import './error_url_overflow.less';
import template from './error_url_overflow.html';
import { UrlOverflowServiceProvider } from './url_overflow_service';

export * from './url_overflow_service';

uiRoutes
.when('/error/url-overflow', {
  template,
  controllerAs: 'controller',
  controller: class OverflowController {
    constructor(Private, config, $scope) {
      const kbnUrl = Private(KbnUrlProvider);
      const urlOverflow = Private(UrlOverflowServiceProvider);

      if (!urlOverflow.get()) {
        kbnUrl.redirectPath('/');
        return;
      }

      this.url = urlOverflow.get();
      this.limit = urlOverflow.failLength();
      $scope.$on('$destroy', () => urlOverflow.clear());
    }
  }
});
