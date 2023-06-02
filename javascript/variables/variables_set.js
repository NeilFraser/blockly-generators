/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['variables_set'] = function(block) {
  // Variable setter.
  const argument0 = javascriptGenerator.valueToCode(
      block, 'VALUE', javascriptGenerator.order.ASSIGNMENT) || '0';
  const varName = javascriptGenerator.nameDB.getName(
      block.fields['VAR'], 'VARIABLE');
  return varName + ' = ' + argument0 + ';\n';
};

// JavaScript is dynamically typed.
javascriptGenerator.block['variables_set_dynamic'] =
  javascriptGenerator.block['variables_set'];
