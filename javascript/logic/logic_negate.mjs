/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['logic_negate'] = function(block) {
  // Negation.
  const order = javascriptGenerator.order.LOGICAL_NOT;
  const argument0 = javascriptGenerator.valueToCode(block, 'BOOL', order) || 'true';
  const code = '!' + argument0;
  return [code, order];
};
