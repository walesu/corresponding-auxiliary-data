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

module.exports = function (api) {
  api.addEndpointDescription('_refresh', {
    methods: ['POST'],
    patterns: ["_refresh", "{indices}/_refresh"]
  });

  api.addEndpointDescription('_flush', {
    methods: ['POST'],
    patterns: ["_flush", "{indices}/_flush"],
    url_params: {
      wait_if_ongoing: [true, false],
      force: [true, false]
    }
  });

  api.addEndpointDescription('_flush_synced', {
    methods: ['POST'],
    patterns: ["_flush/synced", "{indices}/_flush/synced"]
  });

  api.addEndpointDescription('_stats', {
    patterns: ["_stats", "_stats/{metrics}", "{indices}/_stats", "{indices}/_stats/{metrics}"],
    url_components: {
      "metrics": ["docs", "store", "indexing", "search", "get", "merge", "refresh", "flush", "warmer", "filter_cache", "percolate", "segments", "fielddata", "completion", "translog", "query_cache", "commit", "_all"]
    },
    url_params: {
      "fields": [],
      "types": [],
      "completion_fields": [],
      "docvalue_fields": [],
      "level": ["cluster", "indices", "shards"]
    }

  });

  api.addEndpointDescription('_segments', {
    patterns: ["{indices}/_segments", "_segments"]
  });

  api.addEndpointDescription('_recovery', {
    patterns: ["{indices}/_recovery", "_recovery"],
    url_params: {
      detailed: "__flag__",
      active_only: "__flag__",
      human: "__flag__"
    }
  });

  api.addEndpointDescription('_analyze', {
    methods: ['GET', 'POST'],
    patterns: ["{indices}/_analyze", "_analyze"],
    url_params: {
      "analyzer": "",
      "char_filter": [],
      "field": "",
      "filter": [],
      "text": "",
      "tokenizer": "",
      "explain": "__flag__",
      "attributes": []
    },
    data_autocomplete_rules: {
      text: [],
      field: "{field}",
      analyzer: "",
      tokenizer: "",
      char_filter: [],
      filter: [],
      explain: { __one_of: [false, true] },
      attributes: []
    }
  });

  api.addEndpointDescription('_validate_query', {
    methods: ['GET', 'POST'],
    patterns: ["{indices}/_validate/query", "_validate/query"],
    url_params: {
      explain: "__flag__",
      rewrite: "__flag__"
    },
    data_autocomplete_rules: {
      query: {
        // populated by a global rule
      }
    }
  });

  api.addEndpointDescription('_shard_stores', {
    methods: ['GET'],
    patterns: ["{indices}/_shard_stores", "_shard_stores"],
    url_params: {
      status: ["green", "yellow", "red", "all"]
    }
  });

  api.addEndpointDescription('__create_index__', {
    methods: ['PUT'],
    patterns: ["{index}"],
    data_autocomplete_rules: {
      mappings: {
        __scope_link: '_put_mapping'
      },
      settings: {
        __scope_link: '_put_settings'
      },
      aliases: {
        __template: {
          "NAME": {}
        }
      }
    }
  });

  api.addEndpointDescription('__delete_indices__', {
    methods: ['DELETE'],
    patterns: ["{indices}"]
  });

  api.addEndpointDescription('_get_index_settings', {
    methods: ['GET'],
    patterns: ["{indices}/_settings"],
    url_params: {
      flat_settings: "__flag__"
    }
  });

  api.addEndpointDescription('_get_index', {
    methods: ['GET'],
    patterns: ["{indices}", "{indices}/{feature}"],
    url_components: {
      "feature": ["_mappings", "_aliases"]
    }
  });

  api.addEndpointDescription('_cache/clear', {
    patterns: ["_cache/clear", "{indices}/_cache/clear"]
  });

  api.addEndpointDescription('_upgrade', {
    methods: ["POST"],
    patterns: ["_upgrade", "{indices}/_upgrade"],
    url_params: {
      wait_for_completion: "__flag__"
    }
  });

  api.addEndpointDescription('_upgrade_status', {
    methods: ["GET"],
    patterns: ["_upgrade", "{indices}/_upgrade"]
  });
};
