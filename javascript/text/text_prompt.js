/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['text_prompt'] = function(block) {
  // Prompt function.
  let msg;
  if (block.fields['TEXT'] !== undefined) {
    // Internal message.
    msg = javascriptGenerator.quote(block.fields['TEXT']);
  } else {
    // External message.
    msg = javascriptGenerator.valueToCode(block, 'TEXT',
        javascriptGenerator.order.NONE) || "''";
  }
  let code = `window.prompt(${msg})`;
  if (block.fields['TYPE'] === 'NUMBER') {
    code = `Number(${code})`;
  }
  return [code, javascriptGenerator.order.FUNCTION_CALL];
};

javascriptGenerator.block['text_prompt_ext'] =
    javascriptGenerator.block['text_prompt'];
