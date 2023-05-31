/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export default class ModelVariable {
  name;
  type;

  constructor(name, type) {
    this.name = name;
    this.type = type;
  }

  /**
   * This is a read-only data structure.  Freeze!
   */
  freeze() {
    Object.freeze(this);
  }

  toString() {
    return `[variable ${this.name}]`;
  }
}
