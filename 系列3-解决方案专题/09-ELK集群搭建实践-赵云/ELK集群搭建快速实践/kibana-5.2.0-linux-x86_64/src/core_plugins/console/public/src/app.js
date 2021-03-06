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

var $ = require('jquery');

let curl = require('./curl');
let history = require('./history');
let mappings = require('./mappings');
let es = require('./es');
let _ = require('lodash');

export default function init(input, output, sourceLocation = 'stored') {
  $(document.body).removeClass('fouc');

  // set the value of the input and clear the output
  function resetToValues(content) {
    if (content != null) {
      input.update(content);
    }
    output.update("");
  }

  function loadSavedState() {
    var previousSaveState = history.getSavedEditorState();

    if (sourceLocation == "stored") {
      if (previousSaveState) {
        resetToValues(previousSaveState.content);
      }
      else {
        resetToValues();
        input.autoIndent();
      }
    }
    else if (/^https?:\/\//.test(sourceLocation)) {
      var loadFrom = {url: sourceLocation, dataType: "text", kbnXsrfToken: false};
      if (/https?:\/\/api.github.com/.test(sourceLocation)) {
        loadFrom.headers = {Accept: "application/vnd.github.v3.raw"};
      }
      $.ajax(loadFrom).done(function (data) {
        resetToValues(data);
        input.moveToNextRequestEdge(true);
        input.highlightCurrentRequestsAndUpdateActionBar();
        input.updateActionsBar();
      });
    }
    else {
      resetToValues();
    }
    input.moveToNextRequestEdge(true);
  }

  function setupAutosave() {
    var timer;
    var saveDelay = 500;

    input.getSession().on("change", function onChange(e) {
      if (timer) {
        timer = clearTimeout(timer);
      }
      timer = setTimeout(saveCurrentState, saveDelay);
    });
  }

  function saveCurrentState() {
    try {
      var content = input.getValue();
      history.updateCurrentState(content);
    }
    catch (e) {
      console.log("Ignoring saving error: " + e);
    }
  }

  // stupid simple restore function, called when the user
  // chooses to restore a request from the history
  // PREVENTS history from needing to know about the input
  history.restoreFromHistory = function applyHistoryElem(req) {
    var session = input.getSession();
    var pos = input.getCursorPosition();
    var prefix = "";
    var suffix = "\n";
    if (input.parser.isStartRequestRow(pos.row)) {
      pos.column = 0;
      suffix += "\n";
    }
    else if (input.parser.isEndRequestRow(pos.row)) {
      var line = session.getLine(pos.row);
      pos.column = line.length;
      prefix = "\n\n";
    }
    else if (input.parser.isInBetweenRequestsRow(pos.row)) {
      pos.column = 0;
    }
    else {
      pos = input.nextRequestEnd(pos);
      prefix = "\n\n";
    }

    var s = prefix + req.method + " " + req.endpoint;
    if (req.data) {
      s += "\n" + req.data;
    }

    s += suffix;

    session.insert(pos, s);
    input.clearSelection();
    input.moveCursorTo(pos.row + prefix.length, 0);
    input.focus();
  };

  loadSavedState();
  setupAutosave();
  mappings.retrieveAutocompleteInfoFromServer();
};
