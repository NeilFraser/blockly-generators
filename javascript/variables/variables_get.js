/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['variables_get'] = function(block) {
  // Variable getter.
  const code = javascriptGenerator.nameDB.getName(block.fields['VAR'],
      'VARIABLE');
  return [code, javascriptGenerator.order.ATOMIC];
};

// JavaScript is dynamically typed.
javascriptGenerator.block['variables_get_dynamic'] =
  javascriptGenerator.block['variables_get'];
