/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['lists_isEmpty'] = function(block) {
  // Is the string null or array empty?
  const list =
      javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.order.MEMBER) || '[]';
  return ['!' + list + '.length', javascriptGenerator.order.LOGICAL_NOT];
};
