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

/**
 * @name _doc_send_to_es
 *
 * NOTE: Depends upon the es object to make ES requests, and also interacts
 * with courier objects.
 */

import _ from 'lodash';

import errors from 'ui/errors';
import RequestQueueProvider from 'ui/courier/_request_queue';
import FetchProvider from 'ui/courier/fetch/fetch';

export default function (Promise, Private, es, esAdmin, kbnIndex) {
  let requestQueue = Private(RequestQueueProvider);
  let courierFetch = Private(FetchProvider);

  /**
   * Backend for doUpdate and doIndex
   * @param  {String} method - the client method to call
   * @param  {Boolean} validateVersion - should our knowledge
   *                                   of the the docs current version be sent to es?
   * @param  {String} body - HTTP request body
   */
  return function (method, validateVersion, body, ignore) {
    let doc = this;
    // straight assignment will causes undefined values
    let params = _.pick(this._state, ['id', 'type', 'index']);
    params.body = body;
    params.ignore = ignore || [409];

    if (validateVersion && params.id) {
      params.version = doc._getVersion();
    }

    const client = [].concat(params.index).includes(kbnIndex) ? esAdmin : es;
    return client[method](params)
    .then(function (resp) {
      if (resp.status === 409) throw new errors.VersionConflict(resp);

      doc._storeVersion(resp._version);
      doc.id(resp._id);

      let docFetchProm;
      if (method !== 'index') {
        docFetchProm = doc.fetch();
      } else {
        // we already know what the response will be
        docFetchProm = Promise.resolve({
          _id: resp._id,
          _index: params.index,
          _source: body,
          _type: params.type,
          _version: doc._getVersion(),
          found: true
        });
      }

      // notify pending request for this same document that we have updates
      docFetchProm.then(function (fetchResp) {
        // use the key to compair sources
        let key = doc._versionKey();

        // clear the queue and filter out the removed items, pushing the
        // unmatched ones back in.
        let respondTo = requestQueue.splice(0).filter(function (req) {
          let isDoc = req.source._getType() === 'doc';
          let keyMatches = isDoc && req.source._versionKey() === key;

          // put some request back into the queue
          if (!keyMatches) {
            requestQueue.push(req);
            return false;
          }

          return true;
        });

        return courierFetch.fakeFetchThese(respondTo, respondTo.map(function () {
          return _.cloneDeep(fetchResp);
        }));
      });

      return resp._id;
    })
    .catch(function (err) {
      // cast the error
      throw new errors.RequestFailure(err);
    });
  };
};
