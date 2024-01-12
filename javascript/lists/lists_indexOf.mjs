/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['lists_indexOf'] = function(block) {
  // Find an item in the list.
  const operator =
      block.fields['END'] === 'FIRST' ? 'indexOf' : 'lastIndexOf';
  const item =
      javascriptGenerator.valueToCode(block, 'FIND', javascriptGenerator.order.NONE) || "''";
  const list =
      javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.order.MEMBER) || '[]';
  const code = list + '.' + operator + '(' + item + ')';
  if (block.workspace.options.oneBasedIndex) {
    return [code + ' + 1', javascriptGenerator.order.ADDITION];
  }
  return [code, javascriptGenerator.order.FUNCTION_CALL];
};
