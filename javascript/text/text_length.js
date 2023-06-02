/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['text_length'] = function(block) {
  // String or array length.
  const text = javascriptGenerator.valueToCode(block, 'VALUE',
      javascriptGenerator.order.MEMBER) || "''";
  return [text + '.length', javascriptGenerator.order.MEMBER];
};
