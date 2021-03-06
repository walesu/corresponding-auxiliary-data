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

import modules from 'ui/modules';
import chrome from 'ui/chrome';
import DevToolsRegistryProvider from 'ui/registry/dev_tools';

export function hideEmptyDevTools(Private) {
  const hasTools = !!Private(DevToolsRegistryProvider).length;
  if (!hasTools) {
    const navLink = chrome.getNavLinkById('kibana:dev_tools');
    navLink.hidden = true;
  }
}

modules.get('kibana').run(hideEmptyDevTools);
