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

import angular from 'angular';
import _ from 'lodash';
import uiModules from 'ui/modules';
const module = uiModules.get('app/dashboard');

// Used only by the savedDashboards service, usually no reason to change this
module.factory('SavedDashboard', function (courier, config) {
  // SavedDashboard constructor. Usually you'd interact with an instance of this.
  // ID is option, without it one will be generated on save.
  _.class(SavedDashboard).inherits(courier.SavedObject);
  function SavedDashboard(id) {
    // Gives our SavedDashboard the properties of a SavedObject
    SavedDashboard.Super.call(this, {
      type: SavedDashboard.type,
      mapping: SavedDashboard.mapping,
      searchSource: SavedDashboard.searchsource,

      // if this is null/undefined then the SavedObject will be assigned the defaults
      id: id,

      // default values that will get assigned if the doc is new
      defaults: {
        title: 'New Dashboard',
        hits: 0,
        description: '',
        panelsJSON: '[]',
        optionsJSON: angular.toJson({
          darkTheme: config.get('dashboard:defaultDarkTheme')
        }),
        uiStateJSON: '{}',
        version: 1,
        timeRestore: false,
        timeTo: undefined,
        timeFrom: undefined,
        refreshInterval: undefined
      },

      // if an indexPattern was saved with the searchsource of a SavedDashboard
      // object, clear it. It was a mistake
      clearSavedIndexPattern: true
    });
  }

  // save these objects with the 'dashboard' type
  SavedDashboard.type = 'dashboard';

  // if type:dashboard has no mapping, we push this mapping into ES
  SavedDashboard.mapping = {
    title: 'string',
    hits: 'integer',
    description: 'string',
    panelsJSON: 'string',
    optionsJSON: 'string',
    uiStateJSON: 'string',
    version: 'integer',
    timeRestore: 'boolean',
    timeTo: 'string',
    timeFrom: 'string',
    refreshInterval: {
      type: 'object',
      properties: {
        display: {type: 'string'},
        pause: { type: 'boolean'},
        section: { type: 'integer'},
        value: { type: 'integer'}
      }
    }
  };

  SavedDashboard.searchsource = true;

  return SavedDashboard;
});
