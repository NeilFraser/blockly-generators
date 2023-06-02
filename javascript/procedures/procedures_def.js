/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  const funcName = javascriptGenerator.nameDB.getName(
      block.fields['NAME'], 'PROCEDURE');
  let xfix1 = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    xfix1 += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  if (javascriptGenerator.STATEMENT_SUFFIX) {
    xfix1 += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_SUFFIX, block);
  }
  if (xfix1) {
    xfix1 = javascriptGenerator.prefixLines(xfix1, javascriptGenerator.INDENT);
  }
  let loopTrap = '';
  if (javascriptGenerator.INFINITE_LOOP_TRAP) {
    loopTrap = javascriptGenerator.prefixLines(
        javascriptGenerator.injectId(javascriptGenerator.INFINITE_LOOP_TRAP, block),
        javascriptGenerator.INDENT);
  }
  const branch = javascriptGenerator.statementToCode(block, 'STACK');
  let returnValue =
      javascriptGenerator.valueToCode(block, 'RETURN', javascriptGenerator.order.NONE) || '';
  let xfix2 = '';
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = javascriptGenerator.INDENT + 'return ' + returnValue + ';\n';
  }
  const variables = [];
  if (block.mutation) {
    for (const child of block.mutation.children) {
      if (child.tagName === 'arg') {
        variables.push(child.attributes['name']);
      }
    }
  }
  if (block.extraState) {
    if (block.extraState['params']) {
      for (const param of block.extraState['params']) {
        variables.push(param['name']);
      }
    }
  }

  const args = [];
  for (let i = 0; i < variables.length; i++) {
    args[i] = javascriptGenerator.nameDB.getName(variables[i], 'VARIABLE');
  }
  let code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' + xfix1 +
      loopTrap + branch + xfix2 + returnValue + '}';
  code = javascriptGenerator.formatComments(block.comment) + code;
  // Add % so as not to collide with helper functions in definitions list.
  javascriptGenerator.definitions['%' + funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
javascriptGenerator.block['procedures_defnoreturn'] =
    javascriptGenerator.block['procedures_defreturn']
