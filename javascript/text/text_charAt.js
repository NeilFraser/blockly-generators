/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['text_charAt'] = function(block) {
  // Get letter at index.
  // Note: Until January 2013 this block did not have the WHERE input.
  const where = block.fields['WHERE'] || 'FROM_START';
  const textOrder = (where === 'RANDOM') ? javascriptGenerator.order.NONE :
      javascriptGenerator.order.MEMBER;
  const text = javascriptGenerator.valueToCode(block, 'VALUE', textOrder) || "''";
  switch (where) {
    case 'FIRST': {
      const code = text + '.charAt(0)';
      return [code, javascriptGenerator.order.FUNCTION_CALL];
    }
    case 'LAST': {
      const code = text + '.slice(-1)';
      return [code, javascriptGenerator.order.FUNCTION_CALL];
    }
    case 'FROM_START': {
      const at = javascriptGenerator.getAdjusted(block, 'AT');
      // Adjust index if using one-based indices.
      const code = text + '.charAt(' + at + ')';
      return [code, javascriptGenerator.order.FUNCTION_CALL];
    }
    case 'FROM_END': {
      const at = javascriptGenerator.getAdjusted(block, 'AT', 1, true);
      const code = text + '.slice(' + at + ').charAt(0)';
      return [code, javascriptGenerator.order.FUNCTION_CALL];
    }
    case 'RANDOM': {
      const functionName = javascriptGenerator.provideFunction('textRandomLetter', `
function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER}(text) {
  var x = Math.floor(Math.random() * text.length);
  return text[x];
}
`);
      const code = functionName + '(' + text + ')';
      return [code, javascriptGenerator.order.FUNCTION_CALL];
    }
  }
  throw Error('Unhandled option (text_charAt)');
};
