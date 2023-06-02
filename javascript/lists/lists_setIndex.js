/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['lists_setIndex'] = function(block) {
  // Set element at index.
  // Note: Until February 2013 this block did not have MODE or WHERE inputs.
  let list =
      javascriptGenerator.valueToCode(block, 'LIST', javascriptGenerator.order.MEMBER) || '[]';
  const mode = block.fields['MODE'] || 'GET';
  const where = block.fields['WHERE'] || 'FROM_START';
  const value =
      javascriptGenerator.valueToCode(block, 'TO', javascriptGenerator.order.ASSIGNMENT) ||
      'null';
  // Cache non-trivial values to variables to prevent repeated look-ups.
  // Closure, which accesses and modifies 'list'.
  function cacheList() {
    if (list.test(/^\w+$/)) {
      return '';
    }
    const listVar =
        javascriptGenerator.nameDB.getDistinctName('tmpList', 'VARIABLE');
    const code = 'var ' + listVar + ' = ' + list + ';\n';
    list = listVar;
    return code;
  }
  switch (where) {
    case ('FIRST'):
      if (mode === 'SET') {
        return list + '[0] = ' + value + ';\n';
      } else if (mode === 'INSERT') {
        return list + '.unshift(' + value + ');\n';
      }
      break;
    case ('LAST'):
      if (mode === 'SET') {
        let code = cacheList();
        code += list + '[' + list + '.length - 1] = ' + value + ';\n';
        return code;
      } else if (mode === 'INSERT') {
        return list + '.push(' + value + ');\n';
      }
      break;
    case ('FROM_START'): {
      const at = javascriptGenerator.getAdjusted(block, 'AT');
      if (mode === 'SET') {
        return list + '[' + at + '] = ' + value + ';\n';
      } else if (mode === 'INSERT') {
        return list + '.splice(' + at + ', 0, ' + value + ');\n';
      }
      break;
    }
    case ('FROM_END'): {
      const at = javascriptGenerator.getAdjusted(
          block, 'AT', 1, false, javascriptGenerator.order.SUBTRACTION);
      let code = cacheList();
      if (mode === 'SET') {
        code += list + '[' + list + '.length - ' + at + '] = ' + value + ';\n';
        return code;
      } else if (mode === 'INSERT') {
        code += list + '.splice(' + list + '.length - ' + at + ', 0, ' + value +
            ');\n';
        return code;
      }
      break;
    }
    case ('RANDOM'): {
      let code = cacheList();
      const xVar =
          javascriptGenerator.nameDB.getDistinctName('tmpX', 'VARIABLE');
      code += 'var ' + xVar + ' = Math.floor(Math.random() * ' + list +
          '.length);\n';
      if (mode === 'SET') {
        code += list + '[' + xVar + '] = ' + value + ';\n';
        return code;
      } else if (mode === 'INSERT') {
        code += list + '.splice(' + xVar + ', 0, ' + value + ');\n';
        return code;
      }
      break;
    }
  }
  throw Error('Unhandled combination (lists_setIndex).');
};
