/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['text_trim'] = function(block) {
  // Trim spaces.
  const OPERATORS = {
    'LEFT': ".replace(/^[\\s\\xa0]+/, '')",
    'RIGHT': ".replace(/[\\s\\xa0]+$/, '')",
    'BOTH': '.trim()',
  };
  const operator = OPERATORS[block.fields['MODE']];
  const text = javascriptGenerator.valueToCode(block, 'TEXT',
      javascriptGenerator.order.MEMBER) || "''";
  return [text + operator, javascriptGenerator.order.FUNCTION_CALL];
};
