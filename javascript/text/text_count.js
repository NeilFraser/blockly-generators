/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['text_count'] = function(block) {
  const text = javascriptGenerator.valueToCode(block, 'TEXT',
      javascriptGenerator.order.NONE) || "''";
  const sub = javascriptGenerator.valueToCode(block, 'SUB',
      javascriptGenerator.order.NONE) || "''";
  const functionName = javascriptGenerator.provideFunction('textCount', `
function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER}(haystack, needle) {
  if (needle.length) {
    return haystack.split(needle).length - 1;
  }
  return haystack.length + 1;
}
`);
  const code = `${functionName}(${text}, ${sub})`;
  return [code, javascriptGenerator.order.FUNCTION_CALL];
};
