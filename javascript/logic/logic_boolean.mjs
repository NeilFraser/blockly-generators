/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['logic_boolean'] = function(block) {
  // Boolean values true and false.
  const code = (block.fields['BOOL'] === 'TRUE') ? 'true' : 'false';
  return [code, javascriptGenerator.order.ATOMIC];
};
