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
import $ from 'jquery';

const OFFSET = 10;
let $clone;

// translate css properties into their basic direction
const propDirs = {
  top: 'north',
  left: 'west'
};

function positionTooltip(opts, html) {
  if (!opts) return;
  const $chart = $(opts.$chart);
  const $el = $(opts.$el);
  const $window = $(opts.$window || window);
  const $sizer = $(opts.$sizer);
  const prev = $chart.data('previousPlacement') || {};
  const event = opts.event;

  if (!$chart.size() || !$el.size()) return;

  const size = getTtSize(html || $el.html(), $sizer);
  const pos = getBasePosition(size, event);
  const overflow = getOverflow(size, pos, [$chart, $window]);

  const placement = placeToAvoidOverflow(pos, prev, overflow);
  $chart.data('previousPlacement', placement);
  return placement;
}

function getTtSize(ttHtml, $sizer) {
  if ($sizer.html() !== ttHtml) {
    $sizer.html(ttHtml);
  }

  const size = {
    width: $sizer.outerWidth(),
    height: $sizer.outerHeight()
  };

  return size;
}

function getBasePosition(size, event) {
  return {
    east: event.clientX + OFFSET,
    west: event.clientX - size.width - OFFSET,
    south: event.clientY + OFFSET,
    north: event.clientY - size.height - OFFSET
  };
}

function getBounds($el) {
  // in testing, $window is not actually a window, so we need to add
  // the offsets to make it work right.
  const bounds = $el.offset() || { top: 0, left: 0 };
  bounds.top += $el.scrollTop();
  bounds.left += $el.scrollLeft();
  bounds.bottom = bounds.top + $el.outerHeight();
  bounds.right = bounds.left + $el.outerWidth();
  return bounds;
}

function getOverflow(size, pos, containers) {
  const overflow = {};

  containers.map(getBounds).forEach(function (bounds) {
    // number of pixels that the toolip would overflow it's far
    // side, if we placed it that way. (negative === no overflow)
    mergeOverflows(overflow, {
      north: bounds.top - pos.north,
      east: (pos.east + size.width) - bounds.right,
      south: (pos.south + size.height) - bounds.bottom,
      west: bounds.left - pos.west
    });
  });

  (window.overflows || (window.overflows = [])).push(overflow);
  return overflow;
}

function mergeOverflows(dest, src) {
  return _.merge(dest, src, function (a, b) {
    if (a == null || b == null) return a || b;
    if (a < 0 && b < 0) return Math.min(a, b);
    return Math.max(a, b);
  });
}

function pickPlacement(prop, pos, overflow, prev, pref, fallback, placement) {
  const stash = '_' + prop;

  // list of directions in order of preference
  const dirs = _.unique([prev[stash], pref, fallback].filter(Boolean));

  let dir;
  let value;

  // find the first direction that doesn't overflow
  for (let i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (overflow[dir] > 0) continue;
    value = pos[dir];
    break;
  }

  // if we don't find one that doesn't overflow, use
  // the first choice and offset based on overflo
  if (value == null) {
    dir = dirs[0];

    let offset = overflow[dir];
    if (propDirs[prop] === dir) {
      // when the property represents the same direction
      // as dir, we flip the overflow
      offset = offset * -1;
    }

    value = pos[dir] - offset;
  }

  placement[prop] = value;
  placement[stash] = dir;
}

function placeToAvoidOverflow(pos, prev, overflow) {
  const placement = {};
  pickPlacement('top', pos, overflow, prev, 'south', 'north', placement);
  pickPlacement('left', pos, overflow, prev, 'east', 'west', placement);
  return placement;
}

// expose units/helpers for testing
positionTooltip.getTtSize = getTtSize;
positionTooltip.getBasePosition = getBasePosition;
positionTooltip.getOverflow = getOverflow;
positionTooltip.getBounds = getBounds;
positionTooltip.placeToAvoidOverflow = placeToAvoidOverflow;
positionTooltip.removeClone = function () {
  $clone && $clone.remove();
  $clone = null;
};

module.exports = positionTooltip;
