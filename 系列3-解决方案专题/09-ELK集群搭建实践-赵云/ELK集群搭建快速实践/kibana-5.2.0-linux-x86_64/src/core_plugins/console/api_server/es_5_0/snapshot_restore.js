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

'use strict';

var _templateObject = _taggedTemplateLiteral(['type["\']s*:s*["\']fs'], ['type["\']\\s*:\\s*["\']fs']),
    _templateObject2 = _taggedTemplateLiteral(['type["\']s*:s*["\']url'], ['type["\']\\s*:\\s*["\']url']),
    _templateObject3 = _taggedTemplateLiteral(['type["\']s*:s*["\']s3'], ['type["\']\\s*:\\s*["\']s3']),
    _templateObject4 = _taggedTemplateLiteral(['type["\']s*:s*["\']hdfs'], ['type["\']\\s*:\\s*["\']hdfs']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

module.exports = function (api) {
  api.addEndpointDescription('restore_snapshot', {
    methods: ['POST'],
    patterns: ['_snapshot/{id}/{id}/_restore'],
    url_params: {
      wait_for_completion: "__flag__"
    },
    data_autocomplete_rules: {
      indices: "*",
      ignore_unavailable: { __one_of: [true, false] },
      include_global_state: false,
      rename_pattern: "index_(.+)",
      rename_replacement: "restored_index_$1"
    }
  });

  api.addEndpointDescription('single_snapshot', {
    methods: ['GET', 'DELETE'],
    patterns: ['_snapshot/{id}/{id}']
  });

  api.addEndpointDescription('all_snapshots', {
    methods: ['GET'],
    patterns: ['_snapshot/{id}/_all']
  });

  api.addEndpointDescription('put_snapshot', {
    methods: ['PUT'],
    patterns: ['_snapshot/{id}/{id}'],
    url_params: {
      wait_for_completion: "__flag__"
    },
    data_autocomplete_rules: {
      indices: "*",
      ignore_unavailable: { __one_of: [true, false] },
      include_global_state: { __one_of: [true, false] },
      partial: { __one_of: [true, false] }
    }
  });

  api.addEndpointDescription('_snapshot_status', {
    methods: ['GET'],
    patterns: ['_snapshot/_status', '_snapshot/{id}/_status', '_snapshot/{id}/{ids}/_status']
  });

  function getRepositoryType(context, editor) {
    var iter = editor.iterForCurrentLoc();
    // for now just iterate back to the first "type" key
    var t = iter.getCurrentToken();
    var type;
    while (t && t.type.indexOf("url") < 0) {
      if (t.type === 'variable' && t.value === '"type"') {
        t = editor.parser.nextNonEmptyToken(iter);
        if (!t || t.type !== "punctuation.colon") {
          // weird place to be in, but safe choice..
          break;
        }
        t = editor.parser.nextNonEmptyToken(iter);
        if (t && t.type === "string") {
          type = t.value.replace(/"/g, '');
        }
        break;
      }
      t = editor.parser.prevNonEmptyToken(iter);
    }
    return type;
  }

  api.addEndpointDescription('put_repository', {
    methods: ['PUT'],
    patterns: ['_snapshot/{id}'],
    data_autocomplete_rules: {
      __template: { "type": "" },

      "type": {
        __one_of: ["fs", "url", "s3", "hdfs"]
      },
      "settings": {
        __one_of: [{
          //fs
          __condition: {
            lines_regex: String.raw(_templateObject)
          },
          __template: {
            location: "path"
          },
          location: "path",
          compress: { __one_of: [true, false] },
          concurrent_streams: 5,
          chunk_size: "10m",
          max_restore_bytes_per_sec: "20mb",
          max_snapshot_bytes_per_sec: "20mb"
        }, { // url
          __condition: {
            lines_regex: String.raw(_templateObject2)
          },
          __template: {
            url: ""
          },
          url: "",
          concurrent_streams: 5
        }, { //s3
          __condition: {
            lines_regex: String.raw(_templateObject3)
          },
          __template: {
            bucket: ""
          },
          bucket: "",
          region: "",
          base_path: "",
          concurrent_streams: 5,
          chunk_size: "10m",
          compress: { __one_of: [true, false] }
        }, { // hdfs
          __condition: {
            lines_regex: String.raw(_templateObject4)
          },
          __template: {
            path: ""
          },
          uri: "",
          path: "some/path",
          load_defaults: { __one_of: [true, false] },
          conf_location: "cfg.xml",
          concurrent_streams: 5,
          compress: { __one_of: [true, false] },
          chunk_size: "10m"
        }]
      }
    }
  });
};
