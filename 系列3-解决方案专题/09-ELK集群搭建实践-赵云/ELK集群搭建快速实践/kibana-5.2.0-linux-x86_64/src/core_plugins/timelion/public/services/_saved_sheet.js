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
import _ from 'lodash';
import moment from 'moment';
const module = uiModules.get('app/timelion');

// Used only by the savedSheets service, usually no reason to change this
module.factory('SavedSheet', function (courier, config) {

  // SavedSheet constructor. Usually you'd interact with an instance of this.
  // ID is option, without it one will be generated on save.
  _.class(SavedSheet).inherits(courier.SavedObject);
  function SavedSheet(id) {
    // Gives our SavedSheet the properties of a SavedObject
    courier.SavedObject.call(this, {
      type: SavedSheet.type,
      mapping: SavedSheet.mapping,

      // if this is null/undefined then the SavedObject will be assigned the defaults
      id: id,

      // default values that will get assigned if the doc is new
      defaults: {
        title: 'New TimeLion Sheet',
        hits: 0,
        description: '',
        timelion_sheet: ['.es(*)'],
        timelion_interval: 'auto',
        timelion_chart_height: 275,
        timelion_columns: config.get('timelion:default_columns') || 2,
        timelion_rows: config.get('timelion:default_rows') || 2,
        version: 1,
      }
    });
  }

  // save these objects with the 'sheet' type
  SavedSheet.type = 'timelion-sheet';

  // if type:sheet has no mapping, we push this mapping into ES
  SavedSheet.mapping = {
    title: 'string',
    hits: 'integer',
    description: 'string',
    timelion_sheet: 'string',
    timelion_interval: 'string',
    timelion_other_interval: 'string',
    timelion_chart_height: 'integer',
    timelion_columns: 'integer',
    timelion_rows: 'integer',
    version: 'integer'
  };

  return SavedSheet;
});
