/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.mjs';

javascriptGenerator.block['text_join'] = function(block) {
  // Create a string made up of any number of elements of any type.
  const extraState = block.extraState || {};
  if (block.mutation) {
    // Convert XML mutation into extraState.
    extraState['itemCount'] = Number(block.mutation.attributes['items'] || 2);
  }
  const itemCount = extraState['itemCount'];
  switch (itemCount) {
    case 0:
      return ["''", javascriptGenerator.order.ATOMIC];
    case 1: {
      const element = javascriptGenerator.valueToCode(block, 'ADD0',
          javascriptGenerator.order.NONE) || "''";
      if (strRegExp.test(element)) {
        return [element, javascriptGenerator.order.ATOMIC];
      }
      return [`String(${element})`, javascriptGenerator.order.FUNCTION_CALL];
    }
    case 2: {
      const element0 = javascriptGenerator.valueToCode(block, 'ADD0',
          javascriptGenerator.order.NONE) || "''";
      const element1 = javascriptGenerator.valueToCode(block, 'ADD1',
          javascriptGenerator.order.NONE) || "''";
      if (!strRegExp.test(element0)) {
        element0 = `String(${element0})`;
      }
      if (!strRegExp.test(element1)) {
        element1 = `String(${element1})`;
      }
      const code = element0 + ' + ' + element1;
      return [code, javascriptGenerator.order.ADDITION];
    }
    default: {
      const elements = new Array(itemCount);
      for (let i = 0; i < itemCount; i++) {
        elements[i] = javascriptGenerator.valueToCode(block, 'ADD' + i,
            javascriptGenerator.order.NONE) || "''";
      }
      const code = '[' + elements.join(',') + '].join(\'\')';
      return [code, javascriptGenerator.order.FUNCTION_CALL];
    }
  }
};

/**
 * Regular expression to detect a single-quoted string literal.
 */
const strRegExp = /^\s*'([^']|\\')*'\s*$/;
