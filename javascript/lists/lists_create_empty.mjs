/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['lists_create_empty'] = function(block) {
  // Create an empty list.
  return ['[]', javascriptGenerator.order.ATOMIC];
};
