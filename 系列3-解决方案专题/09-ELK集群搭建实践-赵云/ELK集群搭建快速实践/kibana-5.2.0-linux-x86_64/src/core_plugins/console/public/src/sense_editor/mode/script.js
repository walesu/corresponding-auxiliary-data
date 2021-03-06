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
let acequire = require('acequire');
let mode_json = require('ace/mode-json');

var oop = acequire("ace/lib/oop");
var TextMode = acequire("ace/mode/text").Mode;
var MatchingBraceOutdent = acequire("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
var CstyleBehaviour = acequire("ace/mode/behaviour/cstyle").CstyleBehaviour;
var CStyleFoldMode = acequire("ace/mode/folding/cstyle").FoldMode;
var AceTokenizer = acequire("ace/tokenizer").Tokenizer;

var ScriptHighlightRules = require("./script_highlight_rules").ScriptHighlightRules;


export var ScriptMode = function () {
  this.$outdent = new MatchingBraceOutdent();
  this.$behaviour = new CstyleBehaviour();
  this.foldingRules = new CStyleFoldMode();
};
oop.inherits(ScriptMode, TextMode);

(function () {

  this.HighlightRules = ScriptHighlightRules;

  this.getNextLineIndent = function (state, line, tab) {
    var indent = this.$getIndent(line);
    var match = line.match(/^.*[\{\[]\s*$/);
    if (match) {
      indent += tab;
    }

    return indent;
  };

  this.checkOutdent = function (state, line, input) {
    return this.$outdent.checkOutdent(line, input);
  };

  this.autoOutdent = function (state, doc, row) {
    this.$outdent.autoOutdent(doc, row);
  };

  // this.createWorker = function (session) {
  //   var worker = new WorkerClient(["ace", "sense_editor"], "sense_editor/mode/worker", "SenseWorker");
  //   worker.attachToDocument(session.getDocument());


  //   worker.on("error", function (e) {
  //     session.setAnnotations([e.data]);
  //   });

  //   worker.on("ok", function (anno) {
  //     session.setAnnotations(anno.data);
  //   });

  //   return worker;
  // };


}).call(ScriptMode.prototype);
