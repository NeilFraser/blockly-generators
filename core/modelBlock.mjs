/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export default class ModelBlock {
  constructor(type, id) {
    /** @type string */
    this.type = type;
    /** @type string|undefined */
    this.id = id;

    /** @type number */
    this.x = NaN;
    /** @type number */
    this.y = NaN;
    /** @type ModelBlock */
    this.parent = null;
    /** @type ModelBlock */
    this.next = null;
    /** @type !Object */
    this.fields = Object.create(null);
    /** @type !Object */
    this.inputs = Object.create(null);
    /** @type any */
    this.extraState = null;
    /** @type Object */
    this.mutation = null;
    /** @type boolean */
    this.enabled = true;
    /** @type string|undefined */
    this.comment;
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
