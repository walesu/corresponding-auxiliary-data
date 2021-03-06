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

let TAGS_WITH_WS = />\s+</g;

/**
 * Remove all of the whitespace between html tags
 * so that inline elements don't have extra spaces.
 *
 * If you have inline elements (span, a, em, etc.) and any
 * amount of whitespace around them in your markup, then the
 * browser will push them appart. This is ugly in certain
 * senarios and is only fixed by removing the whitespace
 * from the html in the first place (or ugly css hacks).
 *
 * @param  {string} html - the html to modify
 * @return {string} - modified html
 */
export default function noWhiteSpace(html) {
  return html.replace(TAGS_WITH_WS, '><');
};
