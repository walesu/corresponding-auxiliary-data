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

'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var Promise = require('bluebird');
var _ = require('lodash');
var Boom = require('boom');
var chainRunnerFn = require('../handlers/chain_runner.js');
var timelionDefaults = require('../lib/get_namespaced_settings')();

function replyWithError(e, reply) {
  reply({ title: e.toString(), message: e.toString(), stack: e.stack }).code(400);
}

module.exports = function (server) {
  server.route({
    method: ['POST', 'GET'],
    path: '/api/timelion/run',
    handler: _asyncToGenerator(function* (request, reply) {
      try {
        var uiSettings = yield server.uiSettings().getAll(request);

        var tlConfig = require('../handlers/lib/tl_config.js')({
          server: server,
          request: request,
          settings: _.defaults(uiSettings, timelionDefaults) // Just in case they delete some setting.
        });

        var chainRunner = chainRunnerFn(tlConfig);
        var sheet = yield Promise.all(chainRunner.processRequest(request.payload || {
          sheet: [request.query.expression],
          time: {
            from: request.query.from,
            to: request.query.to,
            interval: request.query.interval,
            timezone: request.query.timezone
          }
        }));

        reply({
          sheet: sheet,
          stats: chainRunner.getStats()
        });
      } catch (err) {
        // TODO Maybe we should just replace everywhere we throw with Boom? Probably.
        if (err.isBoom) {
          reply(err);
        } else {
          replyWithError(err, reply);
        }
      }
    })
  });
};
