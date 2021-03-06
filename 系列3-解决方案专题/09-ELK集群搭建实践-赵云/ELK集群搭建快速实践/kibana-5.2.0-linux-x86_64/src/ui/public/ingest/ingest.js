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

import RefreshKibanaIndexProvider from 'plugins/kibana/management/sections/indices/_refresh_kibana_index';
import { keysToCamelCaseShallow, keysToSnakeCaseShallow } from '../../../core_plugins/kibana/common/lib/case_conversion';
import _ from 'lodash';
import angular from 'angular';
import chrome from 'ui/chrome';

export default function IngestProvider($rootScope, $http, config, $q, Private, indexPatterns) {

  const ingestAPIPrefix = chrome.addBasePath('/api/kibana/ingest');
  const refreshKibanaIndex = Private(RefreshKibanaIndexProvider);

  this.save = function (indexPattern) {
    if (_.isEmpty(indexPattern)) {
      throw new Error('index pattern is required');
    }

    const payload = {
      index_pattern: keysToSnakeCaseShallow(indexPattern)
    };

    return $http.post(`${ingestAPIPrefix}`, payload)
    .then(() => {
      if (!config.get('defaultIndex')) {
        config.set('defaultIndex', indexPattern.id);
      }

      indexPatterns.getIds.clearCache();
      $rootScope.$broadcast('ingest:updated');
    });
  };

  this.delete = function (ingestId) {
    if (_.isEmpty(ingestId)) {
      throw new Error('ingest id is required');
    }

    return $http.delete(`${ingestAPIPrefix}/${ingestId}`)
    .then(() => {
      indexPatterns.getIds.clearCache();
      $rootScope.$broadcast('ingest:updated');
    });
  };

  this.uploadCSV = function (file, indexPattern, delimiter) {
    if (_.isUndefined(file)) {
      throw new Error('file is required');
    }
    if (_.isUndefined(indexPattern)) {
      throw new Error('index pattern is required');
    }

    const formData = new FormData();
    formData.append('csv', file);

    const params = {};
    if (!_.isUndefined(delimiter)) {
      params.csv_delimiter = delimiter;
    }

    return $http.post(chrome.addBasePath(`/api/kibana/${indexPattern}/_data`), formData, {
      params: params,
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    });
  };

}
