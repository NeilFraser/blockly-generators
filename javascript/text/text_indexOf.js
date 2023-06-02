/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['text_indexOf'] = function(block) {
  // Search the text for a substring.
  const operator = block.fields['END'] === 'FIRST' ?
      'indexOf' : 'lastIndexOf';
  const substring = javascriptGenerator.valueToCode(block, 'FIND',
      javascriptGenerator.order.NONE) || "''";
  const text = javascriptGenerator.valueToCode(block, 'VALUE',
      javascriptGenerator.order.MEMBER) || "''";
  const code = `${text}.${operator}(${substring})`;
  // Adjust index if using one-based indices.
  if (javascriptGenerator.oneBasedIndex) {
    return [code + ' + 1', javascriptGenerator.order.ADDITION];
  }
  return [code, javascriptGenerator.order.FUNCTION_CALL];
};
