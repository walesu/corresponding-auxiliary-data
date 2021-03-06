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

const URL_MAX_IE = 2000;
const URL_MAX_OTHERS = 25000;
const IE_REGEX = /(;MSIE |Edge\/\d)/;

export class UrlOverflowService {
  constructor() {
    const key = 'error/url-overflow/url';
    const store = window.sessionStorage || {
      getItem() {},
      setItem() {},
      removeItem() {},
    };

    // FIXME: Couldn't find a way to test for browser compatibility without
    // complex redirect and cookie based "feature-detection" page, so going
    // with user-agent detection for now.
    this._ieLike = IE_REGEX.test(window.navigator.userAgent);

    this._val = store.getItem(key);
    this._sync = () => {
      if (this._val == null) store.removeItem(key);
      else store.setItem(key, this._val);
    };
  }

  failLength() {
    return this._ieLike ? URL_MAX_IE : URL_MAX_OTHERS;
  }

  set(v) {
    this._val = v;
    this._sync();
  }

  get() {
    return this._val;
  }

  check(absUrl) {
    if (!this.get()) {
      const urlLength = absUrl.length;
      const remaining = this.failLength() - urlLength;

      if (remaining > 0) {
        return remaining;
      }

      this.set(absUrl);
    }

    throw new Error(`
      The URL has gotten too big and kibana can no longer
      continue. Please refresh to return to your previous state.
    `);
  }

  clear() {
    this._val = undefined;
    this._sync();
  }
}

export function UrlOverflowServiceProvider() {
  return new UrlOverflowService();
}
