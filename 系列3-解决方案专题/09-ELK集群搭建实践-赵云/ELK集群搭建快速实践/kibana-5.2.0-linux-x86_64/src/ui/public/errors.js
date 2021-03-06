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
import angular from 'angular';

const canStack = (function () {
  const err = new Error();
  return !!err.stack;
}());

const errors = {};

// abstract error class
function KbnError(msg, constructor) {
  this.message = msg;

  Error.call(this, this.message);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, constructor || KbnError);
  } else if (canStack) {
    this.stack = (new Error()).stack;
  } else {
    this.stack = '';
  }
}
errors.KbnError = KbnError;
_.class(KbnError).inherits(Error);

/**
 * If the error permits, propagate the error to be rendered on screen
 * @param handler the handlers that can render the error message to the screen.
 */
KbnError.prototype.displayToScreen = function (handler) {
  throw this;
};

/**
 * HastyRefresh error class
 * @param {String} [msg] - An error message that will probably end up in a log.
 */
errors.HastyRefresh = function HastyRefresh() {
  KbnError.call(this,
    'Courier attempted to start a query before the previous had finished.',
    errors.HastyRefresh);
};
_.class(errors.HastyRefresh).inherits(KbnError);

/**
 * SearchTimeout error class
 */
errors.SearchTimeout = function SearchTimeout() {
  KbnError.call(this,
    'All or part of your request has timed out. The data shown may be incomplete.',
    errors.SearchTimeout);
};
_.class(errors.SearchTimeout).inherits(KbnError);

/**
 * Request Failure - When an entire mutli request fails
 * @param {Error} err - the Error that came back
 * @param {Object} resp - optional HTTP response
 */
errors.RequestFailure = function RequestFailure(err, resp) {
  err = err || false;

  KbnError.call(this,
    'Request to Elasticsearch failed: ' + angular.toJson(resp || err.message),
    errors.RequestFailure);

  this.origError = err;
  this.resp = resp;
};
_.class(errors.RequestFailure).inherits(KbnError);

/**
 * FetchFailure Error - when there is an error getting a doc or search within
 *  a multi-response response body
 * @param {String} [msg] - An error message that will probably end up in a log.
 */
errors.FetchFailure = function FetchFailure(resp) {
  KbnError.call(this,
    'Failed to get the doc: ' + angular.toJson(resp),
    errors.FetchFailure);

  this.resp = resp;
};
_.class(errors.FetchFailure).inherits(KbnError);

/**
 * ShardFailure Error - when one or more shards fail
 * @param {String} [msg] - An error message that will probably end up in a log.
 */
errors.ShardFailure = function ShardFailure(resp) {
  KbnError.call(this, resp._shards.failed + ' of ' + resp._shards.total + ' shards failed.',
    errors.ShardFailure);

  this.resp = resp;
};
_.class(errors.ShardFailure).inherits(KbnError);


/**
 * A doc was re-indexed but it was out of date.
 * @param {Object} resp - The response from es (one of the multi-response responses).
 */
errors.VersionConflict = function VersionConflict(resp) {
  KbnError.call(this,
    'Failed to store document changes do to a version conflict.',
    errors.VersionConflict);

  this.resp = resp;
};
_.class(errors.VersionConflict).inherits(KbnError);


/**
 * there was a conflict storing a doc
 * @param {String} field - the fields which contains the conflict
 */
errors.MappingConflict = function MappingConflict(field) {
  KbnError.call(this,
    'Field "' + field + '" is defined with at least two different types in indices matching the pattern',
    errors.MappingConflict);
};
_.class(errors.MappingConflict).inherits(KbnError);

/**
 * a field mapping was using a restricted fields name
 * @param {String} field - the fields which contains the conflict
 */
errors.RestrictedMapping = function RestrictedMapping(field, index) {
  let msg = field + ' is a restricted field name';
  if (index) msg += ', found it while attempting to fetch mapping for index pattern: ' + index;

  KbnError.call(this, msg, errors.RestrictedMapping);
};
_.class(errors.RestrictedMapping).inherits(KbnError);

/**
 * a non-critical cache write to elasticseach failed
 */
errors.CacheWriteFailure = function CacheWriteFailure() {
  KbnError.call(this,
    'A Elasticsearch cache write has failed.',
    errors.CacheWriteFailure);
};
_.class(errors.CacheWriteFailure).inherits(KbnError);

/**
 * when a field mapping is requested for an unknown field
 * @param {String} name - the field name
 */
errors.FieldNotFoundInCache = function FieldNotFoundInCache(name) {
  KbnError.call(this,
    'The ' + name + ' field was not found in the cached mappings',
    errors.FieldNotFoundInCache);
};
_.class(errors.FieldNotFoundInCache).inherits(KbnError);

/**
 * when a mapping already exists for a field the user is attempting to add
 * @param {String} name - the field name
 */
errors.DuplicateField = function DuplicateField(name) {
  KbnError.call(this,
    'The "' + name + '" field already exists in this mapping',
    errors.DuplicateField);
};
_.class(errors.DuplicateField).inherits(KbnError);

/**
 * A saved object was not found
 * @param {String} field - the fields which contains the conflict
 */
errors.SavedObjectNotFound = function SavedObjectNotFound(type, id) {
  this.savedObjectType = type;
  this.savedObjectId = id;
  const idMsg = id ? ' (id: ' + id + ')' : '';
  KbnError.call(this,
    'Could not locate that ' + type + idMsg,
    errors.SavedObjectNotFound);
};
_.class(errors.SavedObjectNotFound).inherits(KbnError);

/**
 * Tried to call a method that relies on SearchSource having an indexPattern assigned
 */
errors.IndexPatternMissingIndices = function IndexPatternMissingIndices(type) {
  KbnError.call(this,
    'IndexPattern\'s configured pattern does not match any indices',
    errors.IndexPatternMissingIndices);
};
_.class(errors.IndexPatternMissingIndices).inherits(KbnError);

/**
 * Tried to call a method that relies on SearchSource having an indexPattern assigned
 */
errors.NoDefinedIndexPatterns = function NoDefinedIndexPatterns(type) {
  KbnError.call(this,
    'Define at least one index pattern to continue',
    errors.NoDefinedIndexPatterns);
};
_.class(errors.NoDefinedIndexPatterns).inherits(KbnError);


/**
 * Tried to load a route besides management/kibana/index but you don't have a default index pattern!
 */
errors.NoDefaultIndexPattern = function NoDefaultIndexPattern(type) {
  KbnError.call(this,
    'Please specify a default index pattern',
    errors.NoDefaultIndexPattern);
};
_.class(errors.NoDefaultIndexPattern).inherits(KbnError);


errors.PersistedStateError = function PersistedStateError(msg) {
  KbnError.call(this,
  'This container is too small to render the visualization',
  errors.ContainerTooSmall);
};
_.class(errors.PersistedStateError).inherits(KbnError);


/**
 * UI Errors
 */
errors.VislibError = class VislibError extends KbnError {
  constructor(message) {
    super(message);
  }

  displayToScreen(handler) {
    handler.error(this.message);
  }
};


errors.ContainerTooSmall = class ContainerTooSmall extends errors.VislibError {
  constructor() {
    super('This container is too small to render the visualization');
  }
};

errors.InvalidWiggleSelection = class InvalidWiggleSelection extends errors.VislibError {
  constructor() {
    super('In wiggle mode the area chart requires ordered values on the x-axis. Try using a Histogram or Date Histogram aggregation.');
  }
};


errors.PieContainsAllZeros = class PieContainsAllZeros extends errors.VislibError {
  constructor() {
    super('No results displayed because all values equal 0.');
  }
};


errors.InvalidLogScaleValues = class InvalidLogScaleValues extends errors.VislibError {
  constructor() {
    super('Values less than 1 cannot be displayed on a log scale');
  }
};


errors.StackedBarChartConfig = class StackedBarChartConfig extends errors.VislibError {
  constructor(message) {
    super(message);
  }
};

/**
 * error thrown when user tries to render an chart with less
 * than the required number of data points
 * @param {String} message - the message to provide with the error
 */
errors.NotEnoughData = class NotEnoughData extends errors.VislibError {
  constructor(message) {
    super(message);
  }
};

errors.NoResults = class NoResults extends errors.VislibError {
  constructor() {
    super('No results found');
  }
};






export default errors;
