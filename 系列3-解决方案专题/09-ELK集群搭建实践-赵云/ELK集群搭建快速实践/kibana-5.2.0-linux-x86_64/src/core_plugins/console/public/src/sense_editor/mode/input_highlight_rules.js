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

let ace = require('ace');
let x_json = require('./x_json_highlight_rules');
let _ = require('lodash');

var oop = ace.require("ace/lib/oop");
var TextHighlightRules = ace.require("ace/mode/text_highlight_rules").TextHighlightRules;

var InputHighlightRules = function () {

  function mergeTokens(/* ... */) {
    return [].concat.apply([], arguments);
  }

  function addEOL(tokens, reg, nextIfEOL, normalNext) {
    if (typeof reg == "object") {
      reg = reg.source;
    }
    return [
      {token: tokens.concat(["whitespace"]), regex: reg + "(\\s*)$", next: nextIfEOL},
      {token: tokens, regex: reg, next: normalNext}
    ];
  }

  // regexp must not have capturing parentheses. Use (?:) instead.
  // regexps are ordered -> the first match is used
  /*jshint -W015 */
  this.$rules = {
    "start": mergeTokens([
        {token: "comment", regex: /^#.*$/},
        {token: "paren.lparen", regex: "{", next: "json", push: true}
      ],
      addEOL(["method"], /([a-zA-Z]+)/, "start", "method_sep")
      ,
      [
        {
          token: "whitespace",
          regex: "\\s+"
        },
        {
          token: "text",
          regex: ".+?"
        }
      ]),
    "method_sep": mergeTokens(
      addEOL(["whitespace", "url.protocol_host", "url.slash"], /(\s+)(https?:\/\/[^?\/,]+)(\/)/, "start", "url"),
      addEOL(["whitespace", "url.protocol_host"], /(\s+)(https?:\/\/[^?\/,]+)/, "start", "url"),
      addEOL(["whitespace", "url.slash"], /(\s+)(\/)/, "start", "url"),
      addEOL(["whitespace"], /(\s+)/, "start", "url")
    ),
    "url": mergeTokens(
      addEOL(["url.part"], /([^?\/,\s]+)/, "start"),
      addEOL(["url.comma"], /(,)/, "start"),
      addEOL(["url.slash"], /(\/)/, "start"),
      addEOL(["url.questionmark"], /(\?)/, "start", "urlParams")
    ),
    "urlParams": mergeTokens(
      addEOL(["url.param", "url.equal", "url.value"], /([^&=]+)(=)([^&]*)/, "start"),
      addEOL(["url.param"], /([^&=]+)/, "start"),
      addEOL(["url.amp"], /(&)/, "start")
    )
  };

  x_json.addToRules(this);

  if (this.constructor === InputHighlightRules) {
    this.normalizeRules();
  }

};

oop.inherits(InputHighlightRules, TextHighlightRules);


module.exports.InputHighlightRules = InputHighlightRules;
