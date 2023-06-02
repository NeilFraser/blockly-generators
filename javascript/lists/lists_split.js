/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['lists_split'] = function(block) {
  // Block for splitting text into a list, or joining a list into text.
  let input = javascriptGenerator.valueToCode(block, 'INPUT', javascriptGenerator.order.MEMBER);
  const delimiter =
      javascriptGenerator.valueToCode(block, 'DELIM', javascriptGenerator.order.NONE) || "''";
  const mode = block.fields['MODE'];
  let functionName;
  if (mode === 'SPLIT') {
    if (!input) {
      input = "''";
    }
    functionName = 'split';
  } else if (mode === 'JOIN') {
    if (!input) {
      input = '[]';
    }
    functionName = 'join';
  } else {
    throw Error('Unknown mode: ' + mode);
  }
  const code = input + '.' + functionName + '(' + delimiter + ')';
  return [code, javascriptGenerator.order.FUNCTION_CALL];
};
