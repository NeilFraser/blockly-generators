/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['controls_for'] = function(block) {
  // For loop.
  const variable =
      javascriptGenerator.nameDB.getName(block.fields['VAR'], 'VARIABLE');
  const argument0 =
      javascriptGenerator.valueToCode(block, 'FROM', javascriptGenerator.order.ASSIGNMENT) || '0';
  const argument1 =
      javascriptGenerator.valueToCode(block, 'TO', javascriptGenerator.order.ASSIGNMENT) || '0';
  const increment =
      javascriptGenerator.valueToCode(block, 'BY', javascriptGenerator.order.ASSIGNMENT) || '1';
  let branch = javascriptGenerator.statementToCode(block, 'DO');
  branch = javascriptGenerator.addLoopTrap(branch, block);
  let code;
  if (isNumber(argument0) && isNumber(argument1) && isNumber(increment)) {
    // All arguments are simple numbers.
    const up = Number(argument0) <= Number(argument1);
    code = `for (${variable} = ${argument0}; ${variable}` +
        (up ? ' <= ' : ' >= ') + argument1 + '; ' + variable;
    const step = Math.abs(Number(increment));
    if (step === 1) {
      code += up ? '++' : '--';
    } else {
      code += (up ? ' += ' : ' -= ') + step;
    }
    code += `) {\n${branch}}\n`;
  } else {
    code = '';
    // Cache non-trivial values to variables to prevent repeated look-ups.
    let startVar = argument0;
    if (!argument0.test(/^\w+$/) && !isNumber(argument0)) {
      startVar = javascriptGenerator.nameDB.getDistinctName(
          variable + '_start', 'VARIABLE');
      code += `var ${startVar} = ${argument0};\n`;
    }
    let endVar = argument1;
    if (!argument1.test(/^\w+$/) && !isNumber(argument1)) {
      endVar = javascriptGenerator.nameDB.getDistinctName(
          variable + '_end', 'VARIABLE');
      code += `var ${endVar} = ${argument1};\n`;
    }
    // Determine loop direction at start, in case one of the bounds
    // changes during loop execution.
    const incVar = javascriptGenerator.nameDB.getDistinctName(
        variable + '_inc', 'VARIABLE');
    code += 'var ' + incVar + ' = ';
    if (isNumber(increment)) {
      code += Math.abs(increment) + ';\n';
    } else {
      code += 'Math.abs(' + increment + ');\n';
    }
    code += `if (${startVar} > ${endVar}) {\n`;
    code += javascriptGenerator.INDENT + incVar + ' = -' + incVar + ';\n';
    code += '}\n';
    code += `for (${variable} = ${startVar}; ${incVar} >= 0 ? ${variable} <= ` +
        `${endVar} : ${variable} >= ${endVar}; ${variable} += ${incVar}) {\n` +
        branch + '}\n';
  }
  return code;
};

/**
 * Is the given string a number (includes negative and decimals).
 *
 * @param str Input string.
 * @returns True if number, false otherwise.
 */
function isNumber(str) {
  return /^\s*-?\d+(\.\d+)?\s*$/.test(str);
}
