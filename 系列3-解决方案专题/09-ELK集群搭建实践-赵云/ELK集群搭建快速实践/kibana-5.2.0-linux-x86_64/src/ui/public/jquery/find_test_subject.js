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

import testSubjSelector from '@spalger/test-subj-selector';

module.exports = function bindToJquery($) {

  /**
   * Find elements with the `data-test-subj` attribute by the terms in that attribute.
   *
   * ```js
   * // this
   * let $button = $('[data-test-subj~="saveButton"]');
   *
   * // becomes this
   * let $button = $.findTestSubject('saveButton');
   * ```
   *
   * Supports multiple subjects
   * ```js
   * // find any saveButton or cancelButton
   * let $buttons = $.findTestSubject('saveButton', 'cancelButton');
   * ```
   *
   * Supports subject "selectors"
   * ```js
   * // find any saveButton inside a savedObjectForm
   * let $button = $.findTestSubject('savedObjectForm saveButton');
   * ```
   *
   * Supports selecting compound subjects
   * ```js
   * // find any smallButton that is also a saveButton inside a savedObjectForm
   * let $input = $.findTestSubject('savedObjectForm smallButton&saveButton');
   * ```
   *
   * @return {jQueryCollection}
   */
  $.findTestSubject = function () {
    return findTestSubject.apply($(document.body), arguments);
  };

  /**
   * Just like $.findTestSubject, except only finds elements within another element.
   * @return {jQueryCollection}
   */
  $.fn.findTestSubject = findTestSubject;

  function findTestSubject(...subjectSelectors) {
    let $els = $();
    let $context = this;

    subjectSelectors.forEach(function (selector) {
      $els = $els.add($context.find(testSubjSelector(selector)));
    });

    return $els;
  };

};
