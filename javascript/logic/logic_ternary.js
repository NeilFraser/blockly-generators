/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['logic_ternary'] = function(block) {
  // Ternary operator.
  const value_if = javascriptGenerator.valueToCode(block, 'IF',
      javascriptGenerator.order.CONDITIONAL) || 'false';
  const value_then = javascriptGenerator.valueToCode(block, 'THEN',
      javascriptGenerator.order.CONDITIONAL) || 'null';
  const value_else = javascriptGenerator.valueToCode(block, 'ELSE',
      javascriptGenerator.order.CONDITIONAL) || 'null';
  const code = `${value_if} ? ${value_then} : ${value_else}`;
  return [code, javascriptGenerator.order.CONDITIONAL];
};
