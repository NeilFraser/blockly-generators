/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['math_random_float'] = function(block) {
  // Random fraction between 0 and 1.
  return ['Math.random()', javascriptGenerator.order.FUNCTION_CALL];
};
