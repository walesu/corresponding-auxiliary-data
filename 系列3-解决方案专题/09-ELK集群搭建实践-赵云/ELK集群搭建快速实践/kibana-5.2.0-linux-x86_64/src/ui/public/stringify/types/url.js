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
import 'ui/field_format_editor/pattern/pattern';
import 'ui/stringify/icons';
import IndexPatternsFieldFormatProvider from 'ui/index_patterns/_field_format/field_format';
import urlTemplate from 'ui/stringify/editors/url.html';
export default function UrlFormatProvider(Private, highlightFilter) {

  let FieldFormat = Private(IndexPatternsFieldFormatProvider);


  _.class(Url).inherits(FieldFormat);
  function Url(params) {
    Url.Super.call(this, params);
    this._compileTemplate = _.memoize(this._compileTemplate);
  }

  Url.id = 'url';
  Url.title = 'Url';
  Url.fieldType = [
    'number',
    'boolean',
    'date',
    'ip',
    'string',
    'murmur3',
    'unknown',
    'conflict'
  ];

  Url.editor = {
    template: urlTemplate,
    controllerAs: 'url',
    controller: function ($scope) {
      let iconPattern = '/bundles/src/ui/public/stringify/icons/{{value}}.png';

      this.samples = {
        a: [ 'john', '/some/pathname/asset.png', 1234 ],
        img: [ 'go', 'stop', ['de', 'ne', 'us', 'ni'], 'cv' ]
      };

      $scope.$watch('editor.formatParams.type', function (type, prev) {
        let params = $scope.editor.formatParams;
        if (type === 'img' && type !== prev && !params.urlTemplate) {
          params.urlTemplate = iconPattern;
        }
      });
    }
  };

  Url.templateMatchRE = /{{([\s\S]+?)}}/g;
  Url.paramDefaults = {
    type: 'a',
    urlTemplate: null,
    labelTemplate: null
  };

  Url.urlTypes = [
    { id: 'a', name: 'Link' },
    { id: 'img', name: 'Image' }
  ];

  Url.prototype._formatUrl = function (value) {
    let template = this.param('urlTemplate');
    if (!template) return value;

    return this._compileTemplate(template)({
      value: encodeURIComponent(value),
      rawValue: value
    });
  };

  Url.prototype._formatLabel = function (value, url) {
    let template = this.param('labelTemplate');
    if (url == null) url = this._formatUrl(value);
    if (!template) return url;

    return this._compileTemplate(template)({
      value: value,
      url: url
    });
  };

  Url.prototype._convert = {
    text: function (value) {
      return this._formatLabel(value);
    },

    html: function (rawValue, field, hit) {
      let url = _.escape(this._formatUrl(rawValue));
      let label = _.escape(this._formatLabel(rawValue, url));

      switch (this.param('type')) {
        case 'img':
          return '<img src="' + url + '" alt="' + label + '" title="' + label + '">';
        default:
          if (hit && hit.highlight && hit.highlight[field.name]) {
            label = highlightFilter(label, hit.highlight[field.name]);
          }

          return '<a href="' + url + '" target="_blank">' + label + '</a>';
      }
    }
  };

  Url.prototype._compileTemplate = function (template) {
    let parts = template.split(Url.templateMatchRE).map(function (part, i) {
      // trim all the odd bits, the variable names
      return (i % 2) ? part.trim() : part;
    });

    return function (locals) {
      // replace all the odd bits with their local var
      let output = '';
      let i = -1;
      while (++i < parts.length) {
        if (i % 2) {
          if (locals.hasOwnProperty(parts[i])) {
            let local = locals[parts[i]];
            output += local == null ? '' : local;
          }
        } else {
          output += parts[i];
        }
      }

      return output;
    };
  };

  return Url;
};
