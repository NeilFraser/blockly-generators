/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['text'] = function(block) {
  // Text value.
  const code = javascriptGenerator.quote(block.fields['TEXT']);
  return [code, javascriptGenerator.order.ATOMIC];
};
