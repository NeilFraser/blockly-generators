/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  const until = block.fields['MODE'] === 'UNTIL';
  let argument =
      javascriptGenerator.valueToCode(block, 'BOOL',
          until ? javascriptGenerator.order.LOGICAL_NOT : javascriptGenerator.order.NONE) ||
      'false';
  let branch = javascriptGenerator.statementToCode(block, 'DO');
  branch = javascriptGenerator.addLoopTrap(branch, block);
  if (until) {
    argument = '!' + argument;
  }
  return `while (${argument}) {\n${branch}}\n`;
};
