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

import angular from 'angular';
import _ from 'lodash';
import WorkQueue from 'ui/routes/work_queue';
import errors from 'ui/errors';


function wrapRouteWithPrep(route, setup) {
  if (!route.resolve && route.redirectTo) return;

  let userWork = new WorkQueue();
  // the point at which we will consider the queue "full"
  userWork.limit = _.keys(route.resolve).length;

  let resolve = {
    __prep__: function ($injector) {
      return $injector.invoke(setup.doWork, setup, { userWork });
    }
  };

  // send each user resolve to the userWork queue, which will prevent it from running before the
  // prep is complete
  _.forOwn(route.resolve || {}, function (expr, name) {
    resolve[name] = function ($injector, Promise) {
      let defer = Promise.defer();
      userWork.push(defer);
      return defer.promise.then(function () {
        return $injector[angular.isString(expr) ? 'get' : 'invoke'](expr);
      });
    };
  });

  // we're copied everything over so now overwrite
  route.resolve = resolve;
}

export default wrapRouteWithPrep;
