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
import uiModules from 'ui/modules';

uiModules.get('kibana')
.config(function ($provide) {

  $provide.decorator('$rootScope', function ($delegate) {
    /**
     * Watch multiple expressions with a single callback. Along
     * with making code simpler it also merges all of the watcher
     * handlers within a single tick.
     *
     * # expression format
     * expressions can be specified in one of the following ways:
     * 1. string that evaluates to a value on scope. Creates a regular $watch
     *    expression.
     *     'someScopeValue.prop' === $scope.$watch('someScopeValue.prop', fn);
     *
     * 2. #1 prefixed with '[]', which uses $watchCollection rather than $watch.
     *     '[]expr' === $scope.$watchCollection('expr', fn);
     *
     * 3. #1 prefixed with '=', which uses $watch with objectEquality turned on
     *     '=expr' === $scope.$watch('expr', fn, true);
     *
     * 4. a function that will be called, like a normal function water
     *
     * 5. an object with any of the properties:
     *   `get`: the getter called on each iteration
     *   `deep`: a flag to turn on objectEquality in $watch
     *   `fn`: the watch registration function ($scope.$watch or $scope.$watchCollection)
     *
     * @param  {array[string|function|obj]} expressions - the list of expressions to $watch
     * @param  {Function} fn - the callback function
     * @return {Function} - an unwatch function, just like the return value of $watch
     */
    $delegate.constructor.prototype.$watchMulti = function (expressions, fn) {
      if (!_.isArray(expressions)) throw new TypeError('expected an array of expressions to watch');
      if (!_.isFunction(fn)) throw new TypeError('expected a function that is triggered on each watch');

      let $scope = this;
      let vals = new Array(expressions.length);
      let prev = new Array(expressions.length);
      let fire = false;
      let init = 0;
      let neededInits = expressions.length;

      // first, register all of the multi-watchers
      let unwatchers = expressions.map(function (expr, i) {
        expr = normalizeExpression($scope, expr);
        if (!expr) return;

        return expr.fn.call($scope, expr.get, function (newVal, oldVal) {
          if (newVal === oldVal) {
            init += 1;
          }

          vals[i] = newVal;
          prev[i] = oldVal;
          fire = true;
        }, expr.deep);
      });

      // then, the watcher that checks to see if any of
      // the other watchers triggered this cycle
      let flip = false;
      unwatchers.push($scope.$watch(function () {
        if (init < neededInits) return init;

        if (fire) {
          fire = false;
          flip = !flip;
        }
        return flip;
      }, function () {
        if (init < neededInits) return false;

        fn(vals.slice(0), prev.slice(0));
        vals.forEach(function (v, i) {
          prev[i] = v;
        });
      }));

      return _.partial(_.callEach, unwatchers);
    };

    function normalizeExpression($scope, expr) {
      if (!expr) return;
      let norm = {
        fn: $scope.$watch,
        deep: false
      };

      if (_.isFunction(expr)) return _.assign(norm, { get: expr });
      if (_.isObject(expr)) return _.assign(norm, expr);
      if (!_.isString(expr)) return;

      if (expr.substr(0, 2) === '[]') {
        return _.assign(norm, {
          fn: $scope.$watchCollection,
          get: expr.substr(2)
        });
      }

      if (expr.charAt(0) === '=') {
        return _.assign(norm, {
          deep: true,
          get: expr.substr(1)
        });
      }

      return _.assign(norm, { get: expr });
    }

    return $delegate;
  });
});
