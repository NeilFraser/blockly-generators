/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['math_on_list'] = function(block) {
  // Math functions for lists.
  const func = block.fields['OP'];
  let list;
  let code;
  switch (func) {
    case 'SUM':
      list = javascriptGenerator.valueToCode(block, 'LIST',
          javascriptGenerator.order.MEMBER) || '[]';
      code = list + '.reduce(function(x, y) {return x + y;}, 0)';
      break;
    case 'MIN':
      list = javascriptGenerator.valueToCode(block, 'LIST',
          javascriptGenerator.order.NONE) || '[]';
      code = 'Math.min.apply(null, ' + list + ')';
      break;
    case 'MAX':
      list = javascriptGenerator.valueToCode(block, 'LIST',
          javascriptGenerator.order.NONE) || '[]';
      code = 'Math.max.apply(null, ' + list + ')';
      break;
    case 'AVERAGE': {
      // mathMean([null,null,1,3]) === 2.0.
      const functionName = javascriptGenerator.provideFunction('mathMean', `
function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER}(myList) {
  return myList.reduce(function(x, y) {return x + y;}, 0) / myList.length;
}
`);
      list = javascriptGenerator.valueToCode(block, 'LIST',
          javascriptGenerator.order.NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    }
    case 'MEDIAN': {
      // mathMedian([null,null,1,3]) === 2.0.
      const functionName = javascriptGenerator.provideFunction('mathMedian', `
function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER}(myList) {
  var localList = myList.filter(function (x) {return typeof x === 'number';});
  if (!localList.length) return null;
  localList.sort(function(a, b) {return b - a;});
  if (localList.length % 2 === 0) {
    return (localList[localList.length / 2 - 1] + localList[localList.length / 2]) / 2;
  } else {
    return localList[(localList.length - 1) / 2];
  }
}
`);
      list = javascriptGenerator.valueToCode(block, 'LIST',
          javascriptGenerator.order.NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    }
    case 'MODE': {
      // As a list of numbers can contain more than one mode,
      // the returned result is provided as an array.
      // Mode of [3, 'x', 'x', 1, 1, 2, '3'] -> ['x', 1].
      const functionName = javascriptGenerator.provideFunction('mathModes', `
function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER}(values) {
  var modes = [];
  var counts = [];
  var maxCount = 0;
  for (var i = 0; i < values.length; i++) {
    var value = values[i];
    var found = false;
    var thisCount;
    for (var j = 0; j < counts.length; j++) {
      if (counts[j][0] === value) {
        thisCount = ++counts[j][1];
        found = true;
        break;
      }
    }
    if (!found) {
      counts.push([value, 1]);
      thisCount = 1;
    }
    maxCount = Math.max(thisCount, maxCount);
  }
  for (var j = 0; j < counts.length; j++) {
    if (counts[j][1] === maxCount) {
        modes.push(counts[j][0]);
    }
  }
  return modes;
}
`);
      list = javascriptGenerator.valueToCode(block, 'LIST',
          javascriptGenerator.order.NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    }
    case 'STD_DEV': {
      const functionName = javascriptGenerator.provideFunction('mathStandardDeviation', `
function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER}(numbers) {
  var n = numbers.length;
  if (!n) return null;
  var mean = numbers.reduce(function(x, y) {return x + y;}) / n;
  var variance = 0;
  for (var j = 0; j < n; j++) {
    variance += Math.pow(numbers[j] - mean, 2);
  }
  variance = variance / n;
  return Math.sqrt(variance);
}
`);
      list = javascriptGenerator.valueToCode(block, 'LIST',
          javascriptGenerator.order.NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    }
    case 'RANDOM': {
      const functionName = javascriptGenerator.provideFunction('mathRandomList', `
function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER}(list) {
  var x = Math.floor(Math.random() * list.length);
  return list[x];
}
`);
      list = javascriptGenerator.valueToCode(block, 'LIST',
          javascriptGenerator.order.NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    }
    default:
      throw Error('Unknown operator: ' + func);
  }
  return [code, javascriptGenerator.order.FUNCTION_CALL];
};
