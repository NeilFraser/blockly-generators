/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['text_print'] = function(block) {
  // Print statement.
  const msg = javascriptGenerator.valueToCode(block, 'TEXT',
      javascriptGenerator.order.NONE) || "''";
  return `window.alert(${msg});\n`;
};
