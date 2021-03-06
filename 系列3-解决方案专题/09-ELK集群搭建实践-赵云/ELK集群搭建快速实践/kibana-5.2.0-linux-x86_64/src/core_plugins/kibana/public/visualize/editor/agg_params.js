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

import IndexedArray from 'ui/indexed_array';
import _ from 'lodash';
import $ from 'jquery';
import aggSelectHtml from 'plugins/kibana/visualize/editor/agg_select.html';
import advancedToggleHtml from 'plugins/kibana/visualize/editor/advanced_toggle.html';
import 'ui/filters/match_any';
import 'plugins/kibana/visualize/editor/agg_param';
import AggTypesIndexProvider from 'ui/agg_types/index';
import uiModules from 'ui/modules';
import aggParamsTemplate from 'plugins/kibana/visualize/editor/agg_params.html';

uiModules
.get('app/visualize')
.directive('visEditorAggParams', function ($compile, $parse, Private, Notifier, $filter) {
  const aggTypes = Private(AggTypesIndexProvider);

  const notify = new Notifier({
    location: 'visAggGroup'
  });

  return {
    restrict: 'E',
    template: aggParamsTemplate,
    scope: true,
    link: function ($scope, $el, attr) {
      $scope.$bind('agg', attr.agg);
      $scope.$bind('groupName', attr.groupName);

      $scope.aggTypeOptions = aggTypes.byType[$scope.groupName];
      $scope.advancedToggled = false;

      // this will contain the controls for the schema (rows or columns?), which are unrelated to
      // controls for the agg, which is why they are first
      const $schemaEditor = $('<div>').addClass('schemaEditors').appendTo($el);

      if ($scope.agg.schema.editor) {
        $schemaEditor.append($scope.agg.schema.editor);
        $compile($schemaEditor)($scope.$new());
      }

      // allow selection of an aggregation
      const $aggSelect = $(aggSelectHtml).appendTo($el);
      $compile($aggSelect)($scope);

      // params for the selected agg, these are rebuilt every time the agg in $aggSelect changes
      let $aggParamEditors; //  container for agg type param editors
      let $aggParamEditorsScope;
      $scope.$watch('agg.type', function updateAggParamEditor(newType, oldType) {
        if ($aggParamEditors) {
          $aggParamEditors.remove();
          $aggParamEditors = null;
        }

        // if there's an old scope, destroy it
        if ($aggParamEditorsScope) {
          $aggParamEditorsScope.$destroy();
          $aggParamEditorsScope = null;
        }

        // create child scope, used in the editors
        $aggParamEditorsScope = $scope.$new();
        $aggParamEditorsScope.indexedFields = $scope.agg.getFieldOptions();

        const agg = $scope.agg;
        if (!agg) return;

        const type = $scope.agg.type;

        if (newType !== oldType) {
          // don't reset on initial load, the
          // saved params should persist
          agg.resetParams();
        }

        if (!type) return;

        const aggParamHTML = {
          basic: [],
          advanced: []
        };

        // build collection of agg params html
        type.params.forEach(function (param, i) {
          let aggParam;

          if ($aggParamEditorsScope.indexedFields) {
            const hasIndexedFields = $aggParamEditorsScope.indexedFields.length > 0;
            const isExtraParam = i > 0;
            if (!hasIndexedFields && isExtraParam) { // don't draw the rest of the options if their are no indexed fields.
              return;
            }
          }


          let type = 'basic';
          if (param.advanced) type = 'advanced';

          if (aggParam = getAggParamHTML(param, i)) {
            aggParamHTML[type].push(aggParam);
          }

        });

        // compile the paramEditors html elements
        let paramEditors = aggParamHTML.basic;

        if (aggParamHTML.advanced.length) {
          paramEditors.push($(advancedToggleHtml).get(0));
          paramEditors = paramEditors.concat(aggParamHTML.advanced);
        }

        $aggParamEditors = $(paramEditors).appendTo($el);
        $compile($aggParamEditors)($aggParamEditorsScope);
      });

      // build HTML editor given an aggParam and index
      function getAggParamHTML(param, idx) {
        // don't show params without an editor
        if (!param.editor) {
          return;
        }

        const attrs = {
          'agg-param': 'agg.type.params[' + idx + ']'
        };

        if (param.advanced) {
          attrs['ng-show'] = 'advancedToggled';
        }

        return $('<vis-agg-param-editor>')
        .attr(attrs)
        .append(param.editor)
        .get(0);
      }
    }
  };
});
