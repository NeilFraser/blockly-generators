/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['text_append'] = function(block) {
  // Append to a variable in place.
  const varName = javascriptGenerator.nameDB.getName(
      block.fields['VAR'], 'VARIABLE');
  let value = javascriptGenerator.valueToCode(block, 'TEXT',
      javascriptGenerator.order.NONE) || "''";
  // Enclose the provided value in 'String(...)' function.
  // Leave string literals alone.
  if (!/^\s*'([^']|\\')*'\s*$/.test(value)) {
    value = `String(${value})`;
  }
  return `${varName} += ${value};\n`;
};
