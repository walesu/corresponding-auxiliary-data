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

const SCALE_MODES = {
  NORMAL: 'normal',
  PERCENTAGE: 'percentage',
  WIGGLE: 'wiggle',
  SILHOUETTE: 'silhouette',
  GROUPED: 'grouped', // this should not be a scale mode but it is at this point to make it compatible with old charts
  ALL: ['normal', 'percentage', 'wiggle', 'silhouette']
};

export default SCALE_MODES;
