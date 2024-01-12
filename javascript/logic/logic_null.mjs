/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['logic_null'] = function(block) {
  // Null data type.
  return ['null', javascriptGenerator.order.ATOMIC];
};
