/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['colour_picker'] = function(block) {
  // Colour picker.
  const code = javascriptGenerator.quote(block.fields['COLOUR']);
  return [code, javascriptGenerator.order.ATOMIC];
};
