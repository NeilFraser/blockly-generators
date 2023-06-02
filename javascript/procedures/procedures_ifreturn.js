/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  const condition = javascriptGenerator.valueToCode(block, 'CONDITION',
      javascriptGenerator.order.NONE) || 'false';
  let code = `if (${condition}) {\n`;
  if (javascriptGenerator.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the return is triggered.
    code += javascriptGenerator.prefixLines(
        javascriptGenerator.injectId(javascriptGenerator.STATEMENT_SUFFIX, block),
        javascriptGenerator.INDENT);
  }
  let hasReturnValue = true;
  if (block.mutation?.attributes?.['value'] === '0') {
    hasReturnValue = false;
  } else if (block.extraState === '<mutation value="0"></mutation>') {
    hasReturnValue = false;
  }

  if (hasReturnValue) {
    const value = javascriptGenerator.valueToCode(block, 'VALUE',
        javascriptGenerator.order.NONE) || 'null';
    code += javascriptGenerator.INDENT + 'return ' + value + ';\n';
  } else {
    code += javascriptGenerator.INDENT + 'return;\n';
  }
  code += '}\n';
  return code;
};
