/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['math_arithmetic'] = function(block) {
  // Basic arithmetic operators, and power.
  const OPERATORS = {
    'ADD': [' + ', javascriptGenerator.order.ADDITION],
    'MINUS': [' - ', javascriptGenerator.order.SUBTRACTION],
    'MULTIPLY': [' * ', javascriptGenerator.order.MULTIPLICATION],
    'DIVIDE': [' / ', javascriptGenerator.order.DIVISION],
    'POWER': [null, javascriptGenerator.order.NONE],  // Handle power separately.
  };
  const tuple = OPERATORS[block.fields['OP']];
  const operator = tuple[0];
  const order = tuple[1];
  const argument0 = javascriptGenerator.valueToCode(block, 'A', order) || '0';
  const argument1 = javascriptGenerator.valueToCode(block, 'B', order) || '0';
  let code;
  // Power in JavaScript (ES5) requires a special case since it has no operator.
  if (!operator) {
    code = `Math.pow(${argument0}, ${argument1})`;
    return [code, javascriptGenerator.order.FUNCTION_CALL];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};
