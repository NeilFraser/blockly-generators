/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['lists_sort'] = function(block) {
  // Block for sorting a list.
  const list =
      javascriptGenerator.valueToCode(block, 'LIST', javascriptGenerator.order.FUNCTION_CALL) ||
      '[]';
  const direction = block.fields['DIRECTION'] === '1' ? 1 : -1;
  const type = block.fields['TYPE'];
  const getCompareFunctionName =
      javascriptGenerator.provideFunction('listsGetSortCompare', `
function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER}(type, direction) {
  var compareFuncs = {
    'NUMERIC': function(a, b) {
        return Number(a) - Number(b); },
    'TEXT': function(a, b) {
        return String(a) > String(b) ? 1 : -1; },
    'IGNORE_CASE': function(a, b) {
        return String(a).toLowerCase() > String(b).toLowerCase() ? 1 : -1; },
  };
  var compare = compareFuncs[type];
  return function(a, b) { return compare(a, b) * direction; };
}
      `);
  return [
    list + '.slice().sort(' + getCompareFunctionName + '("' + type + '", ' +
        direction + '))',
    javascriptGenerator.order.FUNCTION_CALL
  ];
};
