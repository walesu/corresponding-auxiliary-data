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

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
}(this, function (jQuery) {

(function ($) {
  $.fn.selectpicker.defaults = {
    noneSelectedText: 'Ingen valgt',
    noneResultsText: 'Søket gir ingen treff {0}',
    countSelectedText: function (numSelected, numTotal) {
      return (numSelected == 1) ? "{0} alternativ valgt" : "{0} alternativer valgt";
    },
    maxOptionsText: function (numAll, numGroup) {
      return [
        (numAll == 1) ? 'Grense nådd (maks {n} valg)' : 'Grense nådd (maks {n} valg)',
        (numGroup == 1) ? 'Grense for grupper nådd (maks {n} grupper)' : 'Grense for grupper nådd (maks {n} grupper)'
      ];
    },
    selectAllText: 'Merk alle',
    deselectAllText: 'Fjern alle',
    multipleSeparator: ', '
  };
})(jQuery);


}));
