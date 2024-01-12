/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import ModelBlock from './modelBlock.mjs';
import ModelVariable from './modelVariable.mjs';

export default function parseXml(xml) {
  if (typeof xml === 'string') {
    const parser = new DOMParser();
    xml = parser.parseFromString(xml, 'text/xml');
  }
  if (xml?.firstChild?.tagName !== 'xml') {
    throw SyntaxError('Not an XML Node');
  }
  const variableModels = Object.create(null);
  const blockModels = [];
  for (const node of xml.firstChild.children) {
    if (node.tagName === 'block') {
      blockModels.push(parseBlock(node, null));
    }
    if (node.tagName === 'variables') {
      for (const variableNode of node.children) {
        variableModels[variableNode.getAttribute('id')] =
            parseVariable(variableNode);
      }
    }
  }
  return {
    blocks: blockModels,
    variables: variableModels,
  };
}

function parseBlock(blockNode, parentBlock) {
  const blockModel = new ModelBlock(blockNode.getAttribute('type'),
                                    blockNode.getAttribute('id'));
  blockModel.parent = parentBlock;
  if (blockNode.getAttribute('x') !== undefined) {
    blockModel.x = Number(blockNode.getAttribute('x'));
  }
  if (blockNode.getAttribute('y') !== undefined) {
    blockModel.y = Number(blockNode.getAttribute('y'));
  }
  if (blockNode.getAttribute('disabled') === 'true') {
    blockModel.enabled = false;
  }
  for (const node of blockNode.children) {
    switch (node.tagName) {
      case 'comment':
        blockModel.comment = node.textContent;
        break;
      case 'next':
        blockModel.next = parseBlock(blockOrShadow(node), blockModel);
        break;
      case 'value':
      case 'statement':
        blockModel.inputs[node.getAttribute('name')] =
            parseBlock(blockOrShadow(node), blockModel);
        break;
      case 'field':
        blockModel.fields[node.getAttribute('name')] = String(node.textContent);
        break;
      case 'mutation':
        blockModel.mutation = xmlToJson(node);
        break;
    }
  }

  blockModel.freeze();
  return blockModel;
}

function blockOrShadow(node) {
  let block = null;
  let shadow = null;
  for (const child of node.children) {
    if (child.tagName === 'block') {
      block = child;
    } else if (child.tagName === 'shadow') {
      shadow = child;
    }
  }
  return block || shadow;
}

function xmlToJson(value) {
  if (!value || typeof value !== 'object') {
    // Probably a string.
    return value;
  }
  // TODO: Make this a class.
  const json = {
    tagName: value.tagName,
    attributes: {},
    children: [],
    contentText: value.contentText
  };
  for (const attr of value.attributes) {
    json.attributes[attr.name] = attr.value;
  }
  for (const child of value.children) {
    json.children.push(xmlToJson(child));
  }
  return json;
}

function parseVariable(variableNode) {
  const variableModel = new ModelVariable(
      variableNode.textContent, variableNode.getAttribute('type'));

  variableModel.freeze();
  return variableModel;
}
