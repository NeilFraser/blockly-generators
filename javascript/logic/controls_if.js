/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['controls_if'] = function(block) {
  // If/elseif/else condition.
  let n = 0;
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const extraState = block.extraState || {};
  if (block.mutation) {
    // Convert XML mutation into extraState.
    extraState['hasElse'] = !!Number(block.mutation.attributes['else']);
    extraState['elseIfCount'] = Number(block.mutation.attributes['elseif']) || 0;
  }
  do {
    const conditionCode = javascriptGenerator.valueToCode(block, 'IF' + n,
        javascriptGenerator.order.NONE) || 'false';
    let branchCode = javascriptGenerator.statementToCode(block, 'DO' + n);
    if (javascriptGenerator.STATEMENT_SUFFIX) {
      branchCode = javascriptGenerator.prefixLines(
          javascriptGenerator.injectId(javascriptGenerator.STATEMENT_SUFFIX, block),
          javascriptGenerator.INDENT) + branchCode;
    }
    code += (n > 0 ? ' else ' : '') + `if (${conditionCode}) {\n` +
        branchCode + '}';
    n++;
  } while (n <= extraState['elseIfCount']);

  if (extraState['hasElse'] || block.type === 'controls_ifelse' ||
      javascriptGenerator.STATEMENT_SUFFIX) {
    let branchCode = javascriptGenerator.statementToCode(block, 'ELSE');
    if (javascriptGenerator.STATEMENT_SUFFIX) {
      branchCode = javascriptGenerator.prefixLines(
          javascriptGenerator.injectId(javascriptGenerator.STATEMENT_SUFFIX, block),
          javascriptGenerator.INDENT) + branchCode;
    }
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

javascriptGenerator.suppressPrefixSuffix.add('controls_ifelse');
javascriptGenerator.suppressPrefixSuffix.add('controls_if');

javascriptGenerator.block['controls_ifelse'] =
    javascriptGenerator.block['controls_if'];
