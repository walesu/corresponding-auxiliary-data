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

export default function PatternToWildcardFn() {
  return function (format) {
    let wildcard = '';
    let inEscape = false;
    let inPattern = false;

    for (let i = 0; i < format.length; i++) {
      let ch = format.charAt(i);
      switch (ch) {
        case '[':
          inPattern = false;
          if (!inEscape) {
            inEscape = true;
          } else {
            wildcard += ch;
          }
          break;
        case ']':
          if (inEscape) {
            inEscape = false;
          } else if (!inPattern) {
            wildcard += ch;
          }
          break;
        default:
          if (inEscape) {
            wildcard += ch;
          } else if (!inPattern) {
            wildcard += '*';
            inPattern = true;
          }
      }
    }

    return wildcard;
  };
};
