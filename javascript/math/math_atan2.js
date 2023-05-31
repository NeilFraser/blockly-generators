/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['math_atan2'] = function(block) {
  // Arctangent of point (X, Y) in degrees from -180 to 180.
  const argument0 = javascriptGenerator.valueToCode(block, 'X',
      javascriptGenerator.order.NONE) || '0';
  const argument1 = javascriptGenerator.valueToCode(block, 'Y',
      javascriptGenerator.order.NONE) || '0';
  const code = `Math.atan2(${argument1}, ${argument0}) / Math.PI * 180`;
  return [code, javascriptGenerator.order.DIVISION];
};
