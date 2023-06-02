/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['lists_create_with'] = function(block) {
  // Create a list with any number of elements of any type.
  const elements = new Array(block.itemCount_);
  for (let i = 0; i < block.itemCount_; i++) {
    elements[i] =
        javascriptGenerator.valueToCode(block, 'ADD' + i, javascriptGenerator.order.NONE) ||
        'null';
  }
  const code = '[' + elements.join(', ') + ']';
  return [code, javascriptGenerator.order.ATOMIC];
};
