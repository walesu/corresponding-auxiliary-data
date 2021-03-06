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
import Scanner from 'ui/utils/scanner';
import 'plugins/kibana/dashboard/services/_saved_dashboard';
import uiModules from 'ui/modules';
const module = uiModules.get('app/dashboard');
import { SavedObjectLoader } from 'ui/courier/saved_object/saved_object_loader';

// bring in the factory


// Register this service with the saved object registry so it can be
// edited by the object editor.
require('plugins/kibana/management/saved_object_registry').register({
  service: 'savedDashboards',
  title: 'dashboards'
});

// This is the only thing that gets injected into controllers
module.service('savedDashboards', function (SavedDashboard, kbnIndex, esAdmin, kbnUrl) {
  return new SavedObjectLoader(SavedDashboard, kbnIndex, esAdmin, kbnUrl);
});
