/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['math_constant'] = function(block) {
  // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
  const CONSTANTS = {
    'PI': ['Math.PI', javascriptGenerator.order.MEMBER],
    'E': ['Math.E', javascriptGenerator.order.MEMBER],
    'GOLDEN_RATIO': ['(1 + Math.sqrt(5)) / 2', javascriptGenerator.order.DIVISION],
    'SQRT2': ['Math.SQRT2', javascriptGenerator.order.MEMBER],
    'SQRT1_2': ['Math.SQRT1_2', javascriptGenerator.order.MEMBER],
    'INFINITY': ['Infinity', javascriptGenerator.order.ATOMIC],
  };
  return CONSTANTS[block.fields['CONSTANT']];
};
