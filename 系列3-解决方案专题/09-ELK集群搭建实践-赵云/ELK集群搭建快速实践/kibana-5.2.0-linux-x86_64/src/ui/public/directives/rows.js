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

import $ from 'jquery';
import _ from 'lodash';
import AggConfigResult from 'ui/vis/agg_config_result';
import FilterBarFilterBarClickHandlerProvider from 'ui/filter_bar/filter_bar_click_handler';
import uiModules from 'ui/modules';
let module = uiModules.get('kibana');

module.directive('kbnRows', function ($compile, $rootScope, getAppState, Private) {
  let filterBarClickHandler = Private(FilterBarFilterBarClickHandlerProvider);
  return {
    restrict: 'A',
    link: function ($scope, $el, attr) {
      function addCell($tr, contents) {
        let $cell = $(document.createElement('td'));

        // TODO: It would be better to actually check the type of the field, but we don't have
        // access to it here. This may become a problem with the switch to BigNumber
        if (_.isNumeric(contents)) $cell.addClass('numeric-value');

        let createAggConfigResultCell = function (aggConfigResult) {
          let $cell = $(document.createElement('td'));
          let $state = getAppState();
          let clickHandler = filterBarClickHandler($state);
          $cell.scope = $scope.$new();
          $cell.addClass('cell-hover');
          $cell.attr('ng-click', 'clickHandler($event)');
          $cell.scope.clickHandler = function (event) {
            if ($(event.target).is('a')) return; // Don't add filter if a link was clicked
            clickHandler({ point: { aggConfigResult: aggConfigResult } });
          };
          return $compile($cell)($cell.scope);
        };

        if (contents instanceof AggConfigResult) {
          if (contents.type === 'bucket' && contents.aggConfig.getField() && contents.aggConfig.getField().filterable) {
            $cell = createAggConfigResultCell(contents);
          }
          contents = contents.toString('html');
        }

        if (_.isObject(contents)) {
          if (contents.attr) {
            $cell.attr(contents.attr);
          }

          if (contents.class) {
            $cell.addClass(contents.class);
          }

          if (contents.scope) {
            $cell = $compile($cell.html(contents.markup))(contents.scope);
          } else {
            $cell.html(contents.markup);
          }
        } else {
          if (contents === '') {
            $cell.html('&nbsp;');
          } else {
            $cell.html(contents);
          }
        }

        $tr.append($cell);
      }

      function maxRowSize(max, row) {
        return Math.max(max, row.length);
      }

      $scope.$watchMulti([
        attr.kbnRows,
        attr.kbnRowsMin
      ], function (vals) {
        let rows = vals[0];
        let min = vals[1];

        $el.empty();

        if (!_.isArray(rows)) rows = [];
        let width = rows.reduce(maxRowSize, 0);

        if (isFinite(min) && rows.length < min) {
          // clone the rows so that we can add elements to it without upsetting the original
          rows = _.clone(rows);
          // crate the empty row which will be pushed into the row list over and over
          let emptyRow = new Array(width);
          // fill the empty row with values
          _.times(width, function (i) { emptyRow[i] = ''; });
          // push as many empty rows into the row array as needed
          _.times(min - rows.length, function () { rows.push(emptyRow); });
        }

        rows.forEach(function (row) {
          let $tr = $(document.createElement('tr')).appendTo($el);
          row.forEach(function (cell) {
            addCell($tr, cell);
          });
        });
      });
    }
  };
});
