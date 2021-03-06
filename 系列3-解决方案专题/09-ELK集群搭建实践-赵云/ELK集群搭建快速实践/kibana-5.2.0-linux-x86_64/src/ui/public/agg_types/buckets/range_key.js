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

export default function () {

  const id = Symbol('id');

  class RangeKey {
    constructor(bucket) {
      this.gte = bucket.from == null ? -Infinity : bucket.from;
      this.lt = bucket.to == null ? +Infinity : bucket.to;

      this[id] = RangeKey.idBucket(bucket);
    }


    static idBucket(bucket) {
      return `from:${bucket.from},to:${bucket.to}`;
    }

    toString() {
      return this[id];
    }
  }


  return RangeKey;
};
