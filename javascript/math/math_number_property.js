/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['math_number_property'] = function(block) {
  // Check if a number is even, odd, prime, whole, positive, or negative
  // or if it is divisible by certain number. Returns true or false.
  const PROPERTIES = {
    'EVEN': [' % 2 === 0', javascriptGenerator.order.MODULUS, javascriptGenerator.order.EQUALITY],
    'ODD': [' % 2 === 1', javascriptGenerator.order.MODULUS, javascriptGenerator.order.EQUALITY],
    'WHOLE': [' % 1 === 0', javascriptGenerator.order.MODULUS,
        javascriptGenerator.order.EQUALITY],
    'POSITIVE': [' > 0', javascriptGenerator.order.RELATIONAL,
        javascriptGenerator.order.RELATIONAL],
    'NEGATIVE': [' < 0', javascriptGenerator.order.RELATIONAL,
        javascriptGenerator.order.RELATIONAL],
    'DIVISIBLE_BY': [null, javascriptGenerator.order.MODULUS, javascriptGenerator.order.EQUALITY],
    'PRIME': [null, javascriptGenerator.order.NONE, javascriptGenerator.order.FUNCTION_CALL],
  };
  const dropdownProperty = block.fields['PROPERTY'];
  const [suffix, inputOrder, outputOrder] = PROPERTIES[dropdownProperty];
  const numberToCheck = javascriptGenerator.valueToCode(block, 'NUMBER_TO_CHECK',
      inputOrder) || '0';
  let code;
  if (dropdownProperty === 'PRIME') {
    // Prime is a special case as it is not a one-liner test.
    const functionName = javascriptGenerator.provideFunction_('mathIsPrime', `
function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER}(n) {
  // https://en.wikipedia.org/wiki/Primality_test#Naive_methods
  if (n == 2 || n == 3) {
    return true;
  }
  // False if n is NaN, negative, is 1, or not whole.
  // And false if n is divisible by 2 or 3.
  if (isNaN(n) || n <= 1 || n % 1 !== 0 || n % 2 === 0 || n % 3 === 0) {
    return false;
  }
  // Check all the numbers of form 6k +/- 1, up to sqrt(n).
  for (var x = 6; x <= Math.sqrt(n) + 1; x += 6) {
    if (n % (x - 1) === 0 || n % (x + 1) === 0) {
      return false;
    }
  }
  return true;
}
`);
    code = functionName + '(' + numberToCheck + ')';
  } else if (dropdownProperty === 'DIVISIBLE_BY') {
    const divisor = javascriptGenerator.valueToCode(block, 'DIVISOR',
        javascriptGenerator.order.MODULUS) || '0';
    code = numberToCheck + ' % ' + divisor + ' === 0';
  } else {
    code = numberToCheck + suffix;
  }
  return [code, outputOrder];
};
