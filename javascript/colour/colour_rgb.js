/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['colour_rgb'] = function(block) {
  // Compose a colour from RGB components expressed as percentages.
  const red = javascriptGenerator.valueToCode(block, 'RED', javascriptGenerator.order.NONE) || 0;
  const green =
      javascriptGenerator.valueToCode(block, 'GREEN', javascriptGenerator.order.NONE) || 0;
  const blue =
      javascriptGenerator.valueToCode(block, 'BLUE', javascriptGenerator.order.NONE) || 0;
  const functionName = javascriptGenerator.provideFunction('colourRgb', `
function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER_}(r, g, b) {
  r = Math.max(Math.min(Number(r), 100), 0) * 2.55;
  g = Math.max(Math.min(Number(g), 100), 0) * 2.55;
  b = Math.max(Math.min(Number(b), 100), 0) * 2.55;
  r = ('0' + (Math.round(r) || 0).toString(16)).slice(-2);
  g = ('0' + (Math.round(g) || 0).toString(16)).slice(-2);
  b = ('0' + (Math.round(b) || 0).toString(16)).slice(-2);
  return '#' + r + g + b;
}
`);
  const code = `${functionName}(${red}, ${green}, ${blue})`;
  return [code, javascriptGenerator.order.FUNCTION_CALL];
};
