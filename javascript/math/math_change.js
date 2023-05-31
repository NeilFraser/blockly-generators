/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['math_change'] = function(block) {
  // Add to a variable in place.
  const argument0 = javascriptGenerator.valueToCode(block, 'DELTA',
      javascriptGenerator.order.ADDITION) || '0';
  const varName = javascriptGenerator.nameDB.getName(
      block.fields['VAR'], NameType.VARIABLE);
  return varName + ' = (typeof ' + varName + ' === \'number\' ? ' + varName +
      ' : 0) + ' + argument0 + ';\n';
};
