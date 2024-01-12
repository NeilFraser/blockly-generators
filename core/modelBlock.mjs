/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export default class ModelBlock {
  /** @type string */
  type;
  /** @type string|undefined */
  id;
  /** @type number */
  x = NaN;
  /** @type number */
  y = NaN;
  /** @type ModelBlock */
  parent = null;
  /** @type ModelBlock */
  next = null;
  /** @type !Object */
  fields = Object.create(null);
  /** @type !Object */
  inputs = Object.create(null);
  /** @type any */
  extraState = null;
  /** @type Object */
  mutation = null;
  /** @type boolean */
  enabled = true;
  /** @type string|undefined */
  comment;

  constructor(type, id) {
    this.type = type;
    this.id = id;
  }

  /**
   * This is a read-only data structure.  Freeze!
   */
  freeze() {
    Object.freeze(this.fields);
    Object.freeze(this.inputs);
    // extraState: Freezing null or non-objects is ok, it doesn't do anything.
    // Technically we should spider extraState and freeze any nested objects.
    Object.freeze(this.extraState);
    Object.freeze(this);
  }

  toString() {
    return `[block ${this.type}]`;
  }
}
