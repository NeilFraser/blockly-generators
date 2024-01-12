/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['math_constrain'] = function(block) {
  // Constrain a number between two limits.
  const argument0 = javascriptGenerator.valueToCode(block, 'VALUE',
      javascriptGenerator.order.NONE) || '0';
  const argument1 = javascriptGenerator.valueToCode(block, 'LOW',
      javascriptGenerator.order.NONE) || '0';
  const argument2 = javascriptGenerator.valueToCode(block, 'HIGH',
      javascriptGenerator.order.NONE) || 'Infinity';
  const code = `Math.min(Math.max(${argument0}, ${argument1}), ${argument2})`;
  return [code, javascriptGenerator.order.FUNCTION_CALL];
};
