/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['colour_random'] = function(block) {
  // Generate a random colour.
  const functionName = javascriptGenerator.provideFunction('colourRandom', `
function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER}() {
  var num = Math.floor(Math.random() * Math.pow(2, 24));
  return '#' + ('00000' + num.toString(16)).substr(-6);
}
`);
  const code = functionName + '()';
  return [code, javascriptGenerator.order.FUNCTION_CALL];
};
