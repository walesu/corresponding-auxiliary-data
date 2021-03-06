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
import IndexedArray from 'ui/indexed_array';
const notPropsOptNames = IndexedArray.OPT_NAMES.concat('constructor');

/**
 * Create a registry, which is just a Private module provider.
 *
 * The registry allows modifying the values it will provide
 * using the #register method.
 *
 * To access these modules, pass the registry to the Private
 * module loader.
 *
 * # Examples
 *
 * + register a module
 * ```js
 * let registry = require('ui/registry/vis_types');
 * registry.add(function InjectablePrivateModule($http, Promise) {
 *   ...
 * })
 * ```
 *
 * + get all registered modules
 * ```js
 * let visTypes = Private(RegistryVisTypesProvider);
 * ```
 *
 *
 * @param  {object} [spec] - an object describing the properties of
 *                         the registry to create. Any property specified
 *                         that is not listed below will be mixed into the
 *                         final IndexedArray object.
 *
 * # init
 * @param {Function} [spec.constructor] - an injectable function that is called when
 *                                      the registry is first instanciated by the app.
 *
 * # IndexedArray params
 * @param {array[String]} [spec.index] - passed to the IndexedArray constructor
 * @param {array[String]} [spec.group] - passed to the IndexedArray constructor
 * @param {array[String]} [spec.order] - passed to the IndexedArray constructor
 * @param {array[String]} [spec.initialSet] - passed to the IndexedArray constructor
 * @param {array[String]} [spec.immutable] - passed to the IndexedArray constructor
 *
 * @return {[type]}      [description]
 */
export default function createRegistry(spec) {
  spec = spec || {};

  let constructor = _.has(spec, 'constructor') && spec.constructor;
  let iaOpts = _.defaults(_.pick(spec, IndexedArray.OPT_NAMES), { index: ['name'] });
  let props = _.omit(spec, notPropsOptNames);
  let providers = [];

  /**
   * This is the Private module that will be instanciated by
   *
   * @tag:PrivateModule
   * @return {IndexedArray} - an indexed array containing the values
   *                          that were registered, the registry spec
   *                          defines how things will be indexed.
   */
  let registry = function (Private, $injector) {
    // index all of the modules
    iaOpts.initialSet = providers.map(Private);
    let modules = new IndexedArray(iaOpts);

    // mixin other props
    _.assign(modules, props);

    // construct
    if (constructor) {
      modules = $injector.invoke(constructor, modules) || modules;
    }

    return modules;
  };

  registry.displayName = '[registry ' + props.name + ']';

  registry.register = function (privateModule) {
    providers.push(privateModule);
    return registry;
  };

  return registry;
};

