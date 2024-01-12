/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['math_modulo'] = function(block) {
  // Remainder computation.
  const argument0 = javascriptGenerator.valueToCode(block, 'DIVIDEND',
      javascriptGenerator.order.MODULUS) || '0';
  const argument1 = javascriptGenerator.valueToCode(block, 'DIVISOR',
      javascriptGenerator.order.MODULUS) || '0';
  const code = argument0 + ' % ' + argument1;
  return [code, javascriptGenerator.order.MODULUS];
};
