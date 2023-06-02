/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['lists_reverse'] = function(block) {
  // Block for reversing a list.
  const list =
      javascriptGenerator.valueToCode(block, 'LIST', javascriptGenerator.order.FUNCTION_CALL) ||
      '[]';
  const code = list + '.slice().reverse()';
  return [code, javascriptGenerator.order.FUNCTION_CALL];
};
