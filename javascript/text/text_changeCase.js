/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['text_changeCase'] = function(block) {
  // Change capitalization.
  const OPERATORS = {
    'UPPERCASE': '.toUpperCase()',
    'LOWERCASE': '.toLowerCase()',
    'TITLECASE': null,
  };
  const operator = OPERATORS[block.fields['CASE']];
  const textOrder = operator ?
      javascriptGenerator.order.MEMBER : javascriptGenerator.order.NONE;
  const text = javascriptGenerator.valueToCode(block, 'TEXT', textOrder) || "''";
  let code;
  if (operator) {
    // Upper and lower case are functions built into javascriptGenerator.
    code = text + operator;
  } else {
    // Title case is not a native JavaScript function.  Define one.
    const functionName = javascriptGenerator.provideFunction('textToTitleCase', `
function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER}(str) {
  return str.replace(/\\S+/g,
      function(txt) {return txt[0].toUpperCase() + txt.substring(1).toLowerCase();});
}
`);
    code = `${functionName}(${text})`;
  }
  return [code, javascriptGenerator.order.FUNCTION_CALL];
};
