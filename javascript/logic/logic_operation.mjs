/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  const operator = (block.fields['OP'] === 'AND') ? '&&' : '||';
  const order = (operator === '&&') ? javascriptGenerator.order.LOGICAL_AND :
                                      javascriptGenerator.order.LOGICAL_OR;
  let argument0 = javascriptGenerator.valueToCode(block, 'A', order);
  let argument1 = javascriptGenerator.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    const defaultArgument = (operator === '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  const code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};
