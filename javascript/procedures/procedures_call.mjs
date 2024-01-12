/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  let name = '';
  let variables = [];
  if (block.mutation) {
    name = block.mutation.attributes['name'];
    for (const child of block.mutation.children) {
      if (child.tagName === 'arg') {
        variables.push(child.attributes['name']);
      }
    }
  }
  if (block.extraState) {
    if (block.extraState['name']) {
      name = block.extraState['name'];
    }
    if (block.extraState['params']) {
      variables = block.extraState['params'];
    }
  }
  const funcName = javascriptGenerator.nameDB.getName(name, 'PROCEDURE');
  const args = [];
  for (let i = 0; i < variables.length; i++) {
    args[i] = javascriptGenerator.valueToCode(block, 'ARG' + i, javascriptGenerator.order.NONE) ||
        'null';
  }
  const code = funcName + '(' + args.join(', ') + ')';
  return [code, javascriptGenerator.order.FUNCTION_CALL];
};

javascriptGenerator.block['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  // Generated code is for a function call as a statement is the same as a
  // function call as a value, with the addition of line ending.
  const tuple = javascriptGenerator.block['procedures_callreturn'](block);
  return tuple[0] + ';\n';
};
