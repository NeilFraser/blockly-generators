/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['text_multiline'] = function(block) {
  // Text value.
  const code = javascriptGenerator.multiline_quote(block.fields['TEXT']);
  const order = code.includes('+') ?
      javascriptGenerator.order.ADDITION : javascriptGenerator.order.ATOMIC;
  return [code, order];
};
