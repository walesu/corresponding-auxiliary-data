
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
let oop = ace.require("ace/lib/oop");
let TextHighlightRules = ace.require("ace/mode/text_highlight_rules").TextHighlightRules;

let painlessKeywords = (
  "def|int|long|byte|String|float|double|char|null|if|else|while|do|for|continue|break|new|try|catch|throw|this|instanceof|return|ctx"
);

export var ScriptHighlightRules = function () {
    this.name = "ScriptHighlightRules";
    this.$rules = {
      "start": [
            {
              token: "script.comment",
              regex: "\\/\\/.*$"
            },
            {
              token : "script.string.regexp",
              regex : "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"
            },
            {
              token : "script.string", // single line
              regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            },
            {
              token : "script.constant.numeric", // hex
              regex : "0[xX][0-9a-fA-F]+\\b"
            },
            {
              token : "script.constant.numeric", // float
              regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
            },
            {
              token : "script.constant.language.boolean",
              regex : "(?:true|false)\\b"
            },
            {
              token: "script.keyword",
              regex: painlessKeywords
            },
            {
              token : "script.text",
              regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            },
            {
              token : "script.keyword.operator",
              regex : "\\?\\.|\\*\\.|=~|==~|!|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|->|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|typeof|void)"
            },
            {
              token : "script.lparen",
              regex : "[[({]"
            },
            {
              token : "script.rparen",
              regex : "[\\])}]"
            },
            {
              token : "script.text",
              regex : "\\s+"
            }
        ]
  }
};
oop.inherits(ScriptHighlightRules, TextHighlightRules);