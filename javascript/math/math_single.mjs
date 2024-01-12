/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['math_single'] = function(block) {
  // Math operators with single operand.
  const operator = block.fields['OP'];
  let code;
  let arg;
  if (operator === 'NEG') {
    // Negation is a special case given its different operator precedence.
    arg = javascriptGenerator.valueToCode(block, 'NUM',
        javascriptGenerator.order.UNARY_NEGATION) || '0';
    if (arg[0] === '-') {
      // --3 is not legal in JS.
      arg = ' ' + arg;
    }
    code = '-' + arg;
    return [code, javascriptGenerator.order.UNARY_NEGATION];
  }
  if (operator === 'SIN' || operator === 'COS' || operator === 'TAN') {
    arg = javascriptGenerator.valueToCode(block, 'NUM',
        javascriptGenerator.order.DIVISION) || '0';
  } else {
    arg = javascriptGenerator.valueToCode(block, 'NUM',
        javascriptGenerator.order.NONE) || '0';
  }
  // First, handle cases which generate values that don't need parentheses
  // wrapping the code.
  switch (operator) {
    case 'ABS':
      code = `Math.abs(${arg})`;
      break;
    case 'ROOT':
      code = `Math.sqrt(${arg})`;
      break;
    case 'LN':
      code = `Math.log(${arg})`;
      break;
    case 'EXP':
      code = `Math.exp(${arg})`;
      break;
    case 'POW10':
      code = `Math.pow(10, ${arg})`;
      break;
    case 'ROUND':
      code = `Math.round(${arg})`;
      break;
    case 'ROUNDUP':
      code = `Math.ceil(${arg})`;
      break;
    case 'ROUNDDOWN':
      code = `Math.floor(${arg})`;
      break;
    case 'SIN':
      code = `Math.sin(${arg} / 180 * Math.PI)`;
      break;
    case 'COS':
      code = `Math.cos(${arg} / 180 * Math.PI)`;
      break;
    case 'TAN':
      code = `Math.tan(${arg} / 180 * Math.PI)`;
      break;
  }
  if (code) {
    return [code, javascriptGenerator.order.FUNCTION_CALL];
  }
  // Second, handle cases which generate values that may need parentheses
  // wrapping the code.
  switch (operator) {
    case 'LOG10':
      code = `Math.log(${arg}) / Math.log(10)`;
      break;
    case 'ASIN':
      code = `Math.asin(${arg}) / Math.PI * 180`;
      break;
    case 'ACOS':
      code = `Math.acos(${arg}) / Math.PI * 180`;
      break;
    case 'ATAN':
      code = `Math.atan(${arg}) / Math.PI * 180`;
      break;
    default:
      throw Error('Unknown math operator: ' + operator);
  }
  return [code, javascriptGenerator.order.DIVISION];
};

javascriptGenerator.block['math_round'] =
    javascriptGenerator.block['math_single'];

javascriptGenerator.block['math_trig'] =
    javascriptGenerator.block['math_single'];
