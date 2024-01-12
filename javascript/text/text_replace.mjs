/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['text_replace'] = function(block) {
  const text = javascriptGenerator.valueToCode(block, 'TEXT',
      javascriptGenerator.order.NONE) || "''";
  const from = javascriptGenerator.valueToCode(block, 'FROM',
      javascriptGenerator.order.NONE) || "''";
  const to = javascriptGenerator.valueToCode(block, 'TO',
      javascriptGenerator.order.NONE) || "''";
  // The regex escaping code below is taken from the implementation of
  // goog.string.regExpEscape.
  const functionName = javascriptGenerator.provideFunction('textReplace', `
function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER}(haystack, needle, replacement) {
  needle = needle.replace(/([-()\\[\\]{}+?*.$\\^|,:#<!\\\\])/g, '\\\\$1')
                 .replace(/\\x08/g, '\\\\x08');
  return haystack.replace(new RegExp(needle, 'g'), replacement);
}
`);
  const code = `${functionName}(${text}, ${from}, ${to})`;
  return [code, javascriptGenerator.order.FUNCTION_CALL];
};
