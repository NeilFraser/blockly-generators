/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export default class ModelBlock {
  type;
  id;
  x = NaN;
  y = NaN;
  parent = null;
  next = null;
  fields = Object.create(null);
  inputs = Object.create(null);
  extraState = null;
  enabled = true;
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
