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

import uiRoutes from 'ui/routes';
import template from './index.html';

require('ace');
require('ui-bootstrap-custom');

require('ui/modules').get('kibana', ['sense.ui.bootstrap']);
require('ui/tooltip');
require('ui/autoload/styles');

require('./css/sense.less');
require('./src/controllers/sense_controller');
require('./src/directives/sense_history');
require('./src/directives/sense_settings');
require('./src/directives/sense_help');
require('./src/directives/sense_welcome');


uiRoutes.when('/dev_tools/console', {
  controller: 'SenseController',
  template
});
