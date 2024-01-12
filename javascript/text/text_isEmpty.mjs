/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['text_isEmpty'] = function(block) {
  // Is the string null or array empty?
  const text = javascriptGenerator.valueToCode(block, 'VALUE',
      javascriptGenerator.order.MEMBER) || "''";
  return [`!${text}.length`, javascriptGenerator.order.LOGICAL_NOT];
};
