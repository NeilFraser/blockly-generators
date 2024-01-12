/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['lists_repeat'] = function(block) {
  // Create a list with one element repeated.
  const functionName = javascriptGenerator.provideFunction('listsRepeat', `
function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER}(value, n) {
  var array = [];
  for (var i = 0; i < n; i++) {
    array[i] = value;
  }
  return array;
}
`);
  const element =
      javascriptGenerator.valueToCode(block, 'ITEM', javascriptGenerator.order.NONE) || 'null';
  const repeatCount =
      javascriptGenerator.valueToCode(block, 'NUM', javascriptGenerator.order.NONE) || '0';
  const code = functionName + '(' + element + ', ' + repeatCount + ')';
  return [code, javascriptGenerator.order.FUNCTION_CALL];
};
