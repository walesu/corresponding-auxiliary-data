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

const SYSTEM_API_HEADER_NAME = 'kbn-system-api';

/**
 * Adds a custom header designating request as system API
 * @param originalHeaders Object representing set of headers
 * @return Object representing set of headers, with system API header added in
 */
export function addSystemApiHeader(originalHeaders) {
  const systemApiHeaders = {
    [SYSTEM_API_HEADER_NAME]: true
  };
  return {
    ...originalHeaders,
    ...systemApiHeaders
  };
}

/**
 * Returns true if request is a system API request; false otherwise
 *
 * @param request Object Request object created by $http service
 * @return true if request is a system API request; false otherwise
 */
export function isSystemApiRequest(request) {
  return !!request.headers[SYSTEM_API_HEADER_NAME];
}
