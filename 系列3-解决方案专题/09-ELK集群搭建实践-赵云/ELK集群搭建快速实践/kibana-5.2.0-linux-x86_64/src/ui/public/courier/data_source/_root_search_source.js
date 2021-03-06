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

import SearchSourceProvider from 'ui/courier/data_source/search_source';

export default function RootSearchSource(Private, $rootScope, timefilter, Notifier) {
  let SearchSource = Private(SearchSourceProvider);

  let notify = new Notifier({ location: 'Root Search Source' });

  let globalSource = new SearchSource();
  globalSource.inherits(false); // this is the final source, it has no parents
  globalSource.filter(function (globalSource) {
    // dynamic time filter will be called in the _flatten phase of things
    return timefilter.get(globalSource.get('index'));
  });

  let appSource; // set in setAppSource()
  resetAppSource();

  // when the route changes, clear the appSource
  $rootScope.$on('$routeChangeStart', resetAppSource);

  /**
   * Get the current AppSource
   * @return {Promise} - resolved with the current AppSource
   */
  function getAppSource() {
    return appSource;
  }

  /**
   * Set the current AppSource
   * @param {SearchSource} source - The Source that represents the applications "root" search source object
   */
  function setAppSource(source) {
    appSource = source;

    // walk the parent chain until we get to the global source or nothing
    // that's where we will attach to the globalSource
    let literalRoot = source;
    while (literalRoot._parent && literalRoot._parent !== globalSource) {
      literalRoot = literalRoot._parent;
    }

    literalRoot.inherits(globalSource);
  }



  /**
   * Sets the appSource to be a new, empty, SearchSource
   * @return {undefined}
   */
  function resetAppSource() {
    setAppSource(new SearchSource());
  }

  return {
    get: getAppSource,
    set: setAppSource,

    getGlobalSource: function () {
      return globalSource;
    }
  };
};
