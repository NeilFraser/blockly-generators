/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['lists_getSublist'] = function(block) {
  // Get sublist.
  const list =
      javascriptGenerator.valueToCode(block, 'LIST', javascriptGenerator.order.MEMBER) || '[]';
  const where1 = block.fields['WHERE1'];
  const where2 = block.fields['WHERE2'];
  let code;
  if (where1 === 'FIRST' && where2 === 'LAST') {
    code = list + '.slice(0)';
  } else if (
      list.test(/^\w+$/) ||
      (where1 !== 'FROM_END' && where2 === 'FROM_START')) {
    // If the list is a variable or doesn't require a call for length, don't
    // generate a helper function.
    let at1;
    switch (where1) {
      case 'FROM_START':
        at1 = javascriptGenerator.getAdjusted(block, 'AT1');
        break;
      case 'FROM_END':
        at1 = javascriptGenerator.getAdjusted(
            block, 'AT1', 1, false, javascriptGenerator.order.SUBTRACTION);
        at1 = list + '.length - ' + at1;
        break;
      case 'FIRST':
        at1 = '0';
        break;
      default:
        throw Error('Unhandled option (lists_getSublist).');
    }
    let at2;
    switch (where2) {
      case 'FROM_START':
        at2 = javascriptGenerator.getAdjusted(block, 'AT2', 1);
        break;
      case 'FROM_END':
        at2 = javascriptGenerator.getAdjusted(
            block, 'AT2', 0, false, javascriptGenerator.order.SUBTRACTION);
        at2 = list + '.length - ' + at2;
        break;
      case 'LAST':
        at2 = list + '.length';
        break;
      default:
        throw Error('Unhandled option (lists_getSublist).');
    }
    code = list + '.slice(' + at1 + ', ' + at2 + ')';
  } else {
    const at1 = javascriptGenerator.getAdjusted(block, 'AT1');
    const at2 = javascriptGenerator.getAdjusted(block, 'AT2');
    const wherePascalCase = {
      'FIRST': 'First',
      'LAST': 'Last',
      'FROM_START': 'FromStart',
      'FROM_END': 'FromEnd',
    };
    // The value for 'FROM_END' and'FROM_START' depends on `at` so
    // we add it as a parameter.
    const at1Param =
        (where1 === 'FROM_END' || where1 === 'FROM_START') ? ', at1' : '';
    const at2Param =
        (where2 === 'FROM_END' || where2 === 'FROM_START') ? ', at2' : '';
    const functionName = javascriptGenerator.provideFunction(
        'subsequence' + wherePascalCase[where1] + wherePascalCase[where2], `
function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER}(sequence${at1Param}${at2Param}) {
  var start = ${getSubstringIndex('sequence', where1, 'at1')};
  var end = ${getSubstringIndex('sequence', where2, 'at2')} + 1;
  return sequence.slice(start, end);
}
`);
    code = functionName + '(' + list +
        // The value for 'FROM_END' and 'FROM_START' depends on `at` so we
        // pass it.
        ((where1 === 'FROM_END' || where1 === 'FROM_START') ? ', ' + at1 : '') +
        ((where2 === 'FROM_END' || where2 === 'FROM_START') ? ', ' + at2 : '') +
        ')';
  }
  return [code, javascriptGenerator.order.FUNCTION_CALL];
};

/**
 * Returns an expression calculating the index into a list.
 * @param {string} listName Name of the list, used to calculate length.
 * @param {string} where The method of indexing, selected by dropdown in Blockly
 * @param {string=} opt_at The optional offset when indexing from start/end.
 * @returns {string|undefined} Index expression.
 */
const getSubstringIndex = function(listName, where, opt_at) {
  if (where === 'FIRST') {
    return '0';
  } else if (where === 'FROM_END') {
    return listName + '.length - 1 - ' + opt_at;
  } else if (where === 'LAST') {
    return listName + '.length - 1';
  } else {
    return opt_at;
  }
};
