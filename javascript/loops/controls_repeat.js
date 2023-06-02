/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['controls_repeat'] = function(block) {
  // Repeat n times.
  let repeats;
  if (block.fields['TIMES'] !== undefined) {
    // Internal number (controls_repeat).
    repeats = Number(block.fields['TIMES']);
  } else {
    // External number (controls_repeat_ext).
    repeats = javascriptGenerator.valueToCode(block, 'TIMES',
        javascriptGenerator.order.ASSIGNMENT) || '0';
  }
  let branch = javascriptGenerator.statementToCode(block, 'DO');
  branch = javascriptGenerator.addLoopTrap(branch, block);
  let code = '';
  const loopVar =
      javascriptGenerator.nameDB.getDistinctName('count', 'VARIABLE');
  let endVar = repeats;
  if (!/^\s*-?\d+(\.\d+)?\s*$/.test(repeats)) {
    endVar = javascriptGenerator.nameDB.getDistinctName('repeat_end',
        'VARIABLE');
    code += `var ${endVar} = ${repeats};\n`;
  }
  code += `for (var ${loopVar} = 0; ${loopVar} < ${endVar}; ${loopVar}++) {\n` +
      branch + '}\n';
  return code;
};

javascriptGenerator.block['controls_repeat_ext'] =
    javascriptGenerator.block['controls_repeat'];
