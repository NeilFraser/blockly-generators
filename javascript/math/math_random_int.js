/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['math_random_int'] = function(block) {
  // Random integer between [X] and [Y].
  const argument0 = javascriptGenerator.valueToCode(block, 'FROM',
      javascriptGenerator.order.NONE) || '0';
  const argument1 = javascriptGenerator.valueToCode(block, 'TO',
      javascriptGenerator.order.NONE) || '0';
  const functionName = javascriptGenerator.provideFunction_('mathRandomInt', `
function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER}(a, b) {
  if (a > b) {
    // Swap a and b to ensure a is smaller.
    var c = a;
    a = b;
    b = c;
  }
  return Math.floor(Math.random() * (b - a + 1) + a);
}
`);
  const code = `${functionName}(${argument0}, ${argument1})`;
  return [code, javascriptGenerator.order.FUNCTION_CALL];
};
