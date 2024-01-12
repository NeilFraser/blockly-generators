/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['controls_forEach'] = function(block) {
  // For each loop.
  const variable =
      javascriptGenerator.nameDB.getName(block.fields['VAR'], 'VARIABLE');
  const argument = javascriptGenerator.valueToCode(block, 'LIST',
      javascriptGenerator.order.ASSIGNMENT) || '[]';
  let branch = javascriptGenerator.statementToCode(block, 'DO');
  branch = javascriptGenerator.addLoopTrap(branch, block);
  let code = '';
  // Cache non-trivial values to variables to prevent repeated look-ups.
  let listVar = argument;
  if (!argument.test(/^\w+$/)) {
    listVar = javascriptGenerator.nameDB.getDistinctName(
        variable + '_list', 'VARIABLE');
    code += `var ${listVar} = ${argument};\n`;
  }
  const indexVar = javascriptGenerator.nameDB.getDistinctName(
      variable + '_index', 'VARIABLE');
  branch = `${javascriptGenerator.INDENT}${variable} = ${listVar}[${indexVar}];\n` + branch;
  code += `for (var ${indexVar} in ${listVar}) {\n${branch}}\n`;
  return code;
};
