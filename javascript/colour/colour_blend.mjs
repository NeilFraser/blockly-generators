/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['colour_blend'] = function(block) {
  // Blend two colours together.
  const c1 = javascriptGenerator.valueToCode(block, 'COLOUR1',
      javascriptGenerator.order.NONE) || "'#000000'";
  const c2 = javascriptGenerator.valueToCode(block, 'COLOUR2',
      javascriptGenerator.order.NONE) || "'#000000'";
  const ratio = javascriptGenerator.valueToCode(block, 'RATIO',
      javascriptGenerator.order.NONE) || 0.5;
  const functionName = javascriptGenerator.provideFunction('colourBlend', `
function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER}(c1, c2, ratio) {
  ratio = Math.max(Math.min(Number(ratio), 1), 0);
  var r1 = parseInt(c1.substring(1, 3), 16);
  var g1 = parseInt(c1.substring(3, 5), 16);
  var b1 = parseInt(c1.substring(5, 7), 16);
  var r2 = parseInt(c2.substring(1, 3), 16);
  var g2 = parseInt(c2.substring(3, 5), 16);
  var b2 = parseInt(c2.substring(5, 7), 16);
  var r = Math.round(r1 * (1 - ratio) + r2 * ratio);
  var g = Math.round(g1 * (1 - ratio) + g2 * ratio);
  var b = Math.round(b1 * (1 - ratio) + b2 * ratio);
  r = ('0' + (r || 0).toString(16)).slice(-2);
  g = ('0' + (g || 0).toString(16)).slice(-2);
  b = ('0' + (b || 0).toString(16)).slice(-2);
  return '#' + r + g + b;
}
`);
  const code = `${functionName}(${c1}, ${c2}, ${ratio})`;
  return [code, javascriptGenerator.order.FUNCTION_CALL];
};
