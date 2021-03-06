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

import errors from 'ui/errors';

export default function RedirectWhenMissingFn($location, kbnUrl, Notifier, Promise) {
  let SavedObjectNotFound = errors.SavedObjectNotFound;

  let notify = new Notifier();

  /**
   * Creates an error handler that will redirect to a url when a SavedObjectNotFound
   * error is thrown
   *
   * @param  {string|object} mapping - a mapping of url's to redirect to based on the saved object that
   *                                 couldn't be found, or just a string that will be used for all types
   * @return {function} - the handler to pass to .catch()
   */
  return function (mapping) {
    if (typeof mapping === 'string') {
      mapping = { '*': mapping };
    }

    return function (err) {
      // if this error is not "404", rethrow
      if (!(err instanceof SavedObjectNotFound)) throw err;

      let url = mapping[err.savedObjectType] || mapping['*'];
      if (!url) url = '/';

      url += (url.indexOf('?') >= 0 ? '&' : '?') + `notFound=${err.savedObjectType}`;

      notify.error(err);
      kbnUrl.redirect(url);
      return Promise.halt();
    };
  };
};
