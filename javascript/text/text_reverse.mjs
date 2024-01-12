/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['text_reverse'] = function(block) {
  const text = javascriptGenerator.valueToCode(block, 'TEXT',
      javascriptGenerator.order.MEMBER) || "''";
  const code = text + ".split('').reverse().join('')";
  return [code, javascriptGenerator.order.FUNCTION_CALL];
};
