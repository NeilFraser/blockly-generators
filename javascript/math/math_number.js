/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['math_number'] = function(block) {
  // Numeric value.
  const code = Number(block.fields['NUM']);
  const order = code >= 0 ? javascriptGenerator.order.ATOMIC :
                            javascriptGenerator.order.UNARY_NEGATION;
  return [code, order];
};
