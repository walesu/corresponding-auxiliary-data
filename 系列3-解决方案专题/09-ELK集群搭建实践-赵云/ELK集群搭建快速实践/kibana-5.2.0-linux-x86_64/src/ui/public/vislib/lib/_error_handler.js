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
import errors from 'ui/errors';

export default function ErrorHandlerFactory() {

  /**
   * Common errors shared between constructors
   *
   * @class ErrorHandler
   * @constructor
   */
  class ErrorHandler {
    constructor() {

    }

    /**
     * Validates the height and width are > 0
     * min size must be at least 1 px
     *
     * @method validateWidthandHeight
     * @param width {Number} HTMLElement width
     * @param height {Number} HTMLElement height
     * @returns {HTMLElement} HTML div with an error message
     */
    validateWidthandHeight(width, height) {
      const badWidth = _.isNaN(width) || width <= 0;
      const badHeight = _.isNaN(height) || height <= 0;

      if (badWidth || badHeight) {
        throw new errors.ContainerTooSmall();
      }
    };
  }

  return ErrorHandler;
};
