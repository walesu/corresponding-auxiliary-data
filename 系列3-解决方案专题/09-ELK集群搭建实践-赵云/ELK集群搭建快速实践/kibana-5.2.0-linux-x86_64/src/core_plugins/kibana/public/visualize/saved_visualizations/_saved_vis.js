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

/**
 * @name SavedVis
 *
 * @extends SavedObject.
 *
 * NOTE: It's a type of SavedObject, but specific to visualizations.
 */

import _ from 'lodash';
import VisProvider from 'ui/vis';
import uiModules from 'ui/modules';

uiModules
.get('app/visualize')
.factory('SavedVis', function (config, $injector, courier, Promise, savedSearches, Private, Notifier) {
  const Vis = Private(VisProvider);

  const notify = new Notifier({
    location: 'SavedVis'
  });

  _.class(SavedVis).inherits(courier.SavedObject);
  function SavedVis(opts) {
    const self = this;
    opts = opts || {};
    if (typeof opts !== 'object') opts = { id: opts };

    SavedVis.Super.call(self, {
      type: SavedVis.type,
      mapping: SavedVis.mapping,
      searchSource: SavedVis.searchSource,

      id: opts.id,
      indexPattern: opts.indexPattern,
      defaults: {
        title: 'New Visualization',
        visState: (function () {
          if (!opts.type) return null;
          const def = {};
          def.type = opts.type;
          return def;
        }()),
        uiStateJSON: '{}',
        description: '',
        savedSearchId: opts.savedSearchId,
        version: 1
      },

      afterESResp: this._afterEsResp
    });
  }

  SavedVis.type = 'visualization';

  SavedVis.mapping = {
    title: 'string',
    visState: 'json',
    uiStateJSON: 'string',
    description: 'string',
    savedSearchId: 'string',
    version: 'integer'
  };

  SavedVis.searchSource = true;

  SavedVis.prototype._afterEsResp = function () {
    const self = this;

    return self._getLinkedSavedSearch()
    .then(function () {
      self.searchSource.size(0);

      return self.vis ? self._updateVis() : self._createVis();
    })
    .then(function (vis) {
      self.searchSource.aggs(function () {
        self.vis.requesting();
        return self.vis.aggs.toDsl();
      });

      return self;
    });
  };

  SavedVis.prototype._getLinkedSavedSearch = Promise.method(function () {
    const self = this;
    const linkedSearch = !!self.savedSearchId;
    const current = self.savedSearch;

    if (linkedSearch && current && current.id === self.savedSearchId) {
      return;
    }

    if (self.savedSearch) {
      self.searchSource.inherits(self.savedSearch.searchSource.getParent());
      self.savedSearch.destroy();
      self.savedSearch = null;
    }

    if (linkedSearch) {
      return savedSearches.get(self.savedSearchId)
      .then(function (savedSearch) {
        self.savedSearch = savedSearch;
        self.searchSource.inherits(self.savedSearch.searchSource);
      });
    }
  });

  SavedVis.prototype._createVis = function () {
    const self = this;

    if (self.stateJSON) {
      self.visState = Vis.convertOldState(self.typeName, JSON.parse(self.stateJSON));
    }

    // visState doesn't yet exist when importing a visualization, so we can't
    // assume that exists at this point. If it does exist, then we're not
    // importing a visualization, so we want to sync the title.
    if (self.visState) {
      self.visState.title = self.title;
    }
    self.vis = new Vis(
      self.searchSource.get('index'),
      self.visState
    );

    return self.vis;
  };

  SavedVis.prototype._updateVis = function () {
    const self = this;

    self.vis.indexPattern = self.searchSource.get('index');
    self.visState.title = self.title;
    self.vis.setState(self.visState);
  };

  return SavedVis;
});
