/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['lists_getIndex'] = function(block) {
  // Get element at index.
  // Note: Until January 2013 this block did not have MODE or WHERE inputs.
  const mode = block.fields['MODE'] || 'GET';
  const where = block.fields['WHERE'] || 'FROM_START';
  const listOrder =
      (where === 'RANDOM') ? javascriptGenerator.order.NONE : javascriptGenerator.order.MEMBER;
  const list = javascriptGenerator.valueToCode(block, 'VALUE', listOrder) || '[]';

  switch (where) {
    case ('FIRST'):
      if (mode === 'GET') {
        const code = list + '[0]';
        return [code, javascriptGenerator.order.MEMBER];
      } else if (mode === 'GET_REMOVE') {
        const code = list + '.shift()';
        return [code, javascriptGenerator.order.MEMBER];
      } else if (mode === 'REMOVE') {
        return list + '.shift();\n';
      }
      break;
    case ('LAST'):
      if (mode === 'GET') {
        const code = list + '.slice(-1)[0]';
        return [code, javascriptGenerator.order.MEMBER];
      } else if (mode === 'GET_REMOVE') {
        const code = list + '.pop()';
        return [code, javascriptGenerator.order.MEMBER];
      } else if (mode === 'REMOVE') {
        return list + '.pop();\n';
      }
      break;
    case ('FROM_START'): {
      const at = javascriptGenerator.getAdjusted(block, 'AT');
      if (mode === 'GET') {
        const code = list + '[' + at + ']';
        return [code, javascriptGenerator.order.MEMBER];
      } else if (mode === 'GET_REMOVE') {
        const code = list + '.splice(' + at + ', 1)[0]';
        return [code, javascriptGenerator.order.FUNCTION_CALL];
      } else if (mode === 'REMOVE') {
        return list + '.splice(' + at + ', 1);\n';
      }
      break;
    }
    case ('FROM_END'): {
      const at = javascriptGenerator.getAdjusted(block, 'AT', 1, true);
      if (mode === 'GET') {
        const code = list + '.slice(' + at + ')[0]';
        return [code, javascriptGenerator.order.FUNCTION_CALL];
      } else if (mode === 'GET_REMOVE') {
        const code = list + '.splice(' + at + ', 1)[0]';
        return [code, javascriptGenerator.order.FUNCTION_CALL];
      } else if (mode === 'REMOVE') {
        return list + '.splice(' + at + ', 1);';
      }
      break;
    }
    case ('RANDOM'): {
      const functionName = javascriptGenerator.provideFunction('listsGetRandomItem', `
function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER}(list, remove) {
  var x = Math.floor(Math.random() * list.length);
  if (remove) {
    return list.splice(x, 1)[0];
  } else {
    return list[x];
  }
}
`);
      const code = functionName + '(' + list + ', ' + (mode !== 'GET') + ')';
      if (mode === 'GET' || mode === 'GET_REMOVE') {
        return [code, javascriptGenerator.order.FUNCTION_CALL];
      } else if (mode === 'REMOVE') {
        return code + ';\n';
      }
      break;
    }
  }
  throw Error('Unhandled combination (lists_getIndex).');
};
