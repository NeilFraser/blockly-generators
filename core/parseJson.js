/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import ModelBlock from './modelBlock.js';
import ModelVariable from './modelVariable.js';

export default function parseJson(json) {
  if (typeof json === 'string') {
    json = JSON.parse(json);
  }
  if (!json || typeof json !== 'object') {
    throw SyntaxError('Not a JSON Object');
  }
  const variableModels = Object.create(null);
  if (json['variables']) {
    for (const variableJson of json['variables']) {
      variableModels[variableJson['id']] = parseVariable(variableJson);
    }
  }
  const blockModels = [];
  if (json['blocks']) {
    for (const blockJson of json['blocks']['blocks']) {
      blockModels.push(parseBlock(blockJson, null));
    }
  }
  return Object.freeze({
    blocks: Object.freeze(blockModels),
    variables: Object.freeze(variableModels),
  });
}

function parseBlock(blockJson, parentBlock) {
  const blockModel = new ModelBlock(blockJson['type'], blockJson['id']);
  blockModel.parent = parentBlock;
  if (blockJson['x'] !== undefined) {
    blockModel.x = blockJson['x'];
  }
  if (blockJson['y'] !== undefined) {
    blockModel.y = blockJson['y'];
  }
  if (blockJson['enabled'] === false) {
    blockModel.enabled = false;
  }
  if (blockJson['comment']) {
    blockModel.comment = blockJson['comment']['text'];
  }
  const next = blockJson['next'];
  if (next !== undefined) {
    blockModel.next =
        parseBlock(next['block'] || next['shadow'], blockModel);
  }
  const fields = blockJson['fields'];
  if (fields !== undefined) {
    for (const name in fields) {
      blockModel.fields[name] = String(fields[name]);
    }
  }
  const inputs = blockJson['inputs'];
  if (inputs !== undefined) {
    for (const name in inputs) {
      const value = inputs[name];
      blockModel.inputs[name] =
          parseBlock(value['block'] || value['shadow'], blockModel);
    }
  }
  const extraState = blockJson['extraState'];
  if (extraState !== undefined) {
    // Make a deep copy.
    blockModel.extraState = JSON.parse(JSON.stringify(extraState));
  }

  blockModel.freeze();
  return blockModel;
}

function parseVariable(variableJson) {
  const variableModel = new ModelVariable(
      variableJson['name'], variableJson['type']);

  variableModel.freeze();
  return variableModel;
}
