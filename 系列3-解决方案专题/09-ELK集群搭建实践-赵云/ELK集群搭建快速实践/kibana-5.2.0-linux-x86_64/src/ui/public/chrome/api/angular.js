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
import { format as formatUrl, parse as parseUrl } from 'url';

import modules from 'ui/modules';
import Notifier from 'ui/notify/notifier';
import { UrlOverflowServiceProvider } from '../../error_url_overflow';

const URL_LIMIT_WARN_WITHIN = 1000;

module.exports = function (chrome, internals) {
  chrome.getFirstPathSegment = _.noop;
  chrome.getBreadcrumbs = _.noop;

  chrome.setupAngular = function () {
    let kibana = modules.get('kibana');

    _.forOwn(chrome.getInjected(), function (val, name) {
      kibana.value(name, val);
    });

    kibana
    .value('kbnVersion', internals.version)
    .value('buildNum', internals.buildNum)
    .value('buildSha', internals.buildSha)
    .value('serverName', internals.serverName)
    .value('uiSettings', internals.uiSettings)
    .value('sessionId', Date.now())
    .value('chrome', chrome)
    .value('esUrl', (function () {
      let a = document.createElement('a');
      a.href = chrome.addBasePath('/elasticsearch');
      return a.href;
    }()))
    .value('esAdminUrl', (function () {
      const a = document.createElement('a');
      a.href = chrome.addBasePath('/es_admin');
      return a.href;
    }()))
    .config(chrome.$setupXsrfRequestInterceptor)
    .config(['$compileProvider', function ($compileProvider) {
      if (!internals.devMode) {
        $compileProvider.debugInfoEnabled(false);
      }
    }])
    .run(($location, $rootScope, Private) => {
      chrome.getFirstPathSegment = () => {
        return $location.path().split('/')[1];
      };

      chrome.getBreadcrumbs = () => {
        let path = $location.path();
        let length = path.length - 1;

        // trim trailing slash
        if (path.charAt(length) === '/') {
          length--;
        }

        return path.substr(1, length)
          .replace(/_/g, ' ') // Present snake-cased breadcrumb names as individual words
          .split('/');
      };

      const notify = new Notifier();
      const urlOverflow = Private(UrlOverflowServiceProvider);
      const check = (event) => {
        if ($location.path() === '/error/url-overflow') return;

        try {
          if (urlOverflow.check($location.absUrl()) <= URL_LIMIT_WARN_WITHIN) {
            notify.directive({
              template: `
                <p>
                  The URL has gotten big and may cause Kibana
                  to stop working. Please either enable the
                  <code>state:storeInSessionStorage</code>
                  option in the <a href="#/management/kibana/settings">advanced
                  settings</a> or simplify the onscreen visuals.
                </p>
              `
            }, {
              type: 'error',
              actions: [{ text: 'close' }]
            });
          }
        } catch (e) {
          const { host, path, search, protocol } = parseUrl(window.location.href);
          // rewrite the entire url to force the browser to reload and
          // discard any potentially unstable state from before
          window.location.href = formatUrl({ host, path, search, protocol, hash: '#/error/url-overflow' });
        }
      };

      $rootScope.$on('$routeUpdate', check);
      $rootScope.$on('$routeChangeStart', check);
    });

    require('../directives')(chrome, internals);

    modules.link(kibana);
  };

};
