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

import 'plugins/tagcloud/tag_cloud.less';
import 'plugins/tagcloud/tag_cloud_controller';
import 'plugins/tagcloud/tag_cloud_vis_params';
import TemplateVisTypeTemplateVisTypeProvider from 'ui/template_vis_type/template_vis_type';
import VisSchemasProvider from 'ui/vis/schemas';
import tagCloudTemplate from 'plugins/tagcloud/tag_cloud_controller.html';
import visTypes from 'ui/registry/vis_types';

visTypes.register(function TagCloudProvider(Private) {
  const TemplateVisType = Private(TemplateVisTypeTemplateVisTypeProvider);
  const Schemas = Private(VisSchemasProvider);

  return new TemplateVisType({
    name: 'tagcloud',
    title: 'Tag cloud',
    implementsRenderComplete: true,
    description: 'A tag cloud visualization is a visual representation of text data, ' +
    'typically used to visualize free form text. Tags are usually single words. The font size of word corresponds' +
    'with its importance.',
    icon: 'fa-cloud',
    template: tagCloudTemplate,
    params: {
      defaults: {
        scale: 'linear',
        orientation: 'single',
        minFontSize: 18,
        maxFontSize: 72
      },
      scales: ['linear', 'log', 'square root'],
      orientations: ['single', 'right angled', 'multiple'],
      editor: '<tagcloud-vis-params></tagcloud-vis-params>'
    },
    schemas: new Schemas([
      {
        group: 'metrics',
        name: 'metric',
        title: 'Tag Size',
        min: 1,
        max: 1,
        aggFilter: ['!std_dev', '!percentiles', '!percentile_ranks'],
        defaults: [
          { schema: 'metric', type: 'count' }
        ]
      },
      {
        group: 'buckets',
        name: 'segment',
        icon: 'fa fa-cloud',
        title: 'Tags',
        min: 1,
        max: 1,
        aggFilter: ['terms']
      }
    ])
  });
});


