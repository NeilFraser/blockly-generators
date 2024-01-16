/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Database for variable and procedure names.
 * @class
 */

/**
 * Class for a database of entity names (variables, procedures, etc).
 */
export default class Names {
  /**
   * @param reservedWordsList A comma-separated string of words that are illegal
   *     for use as names in a language (e.g. 'new,if,this,...').
   * @param map A map of ID -> variable models.
   */
  constructor(reservedWordsList, map) {
    this.reservedWords_ = new Set(
      reservedWordsList ? reservedWordsList.split(',') : []
    );
    /**
     * The variable map from the serialization, containing variable types.
     */
    this.variableMap_ = map;

    this.kinds_ = new Map();

    /**
     * A map from kind (e.g. 'VARIABLE', 'PROCEDURE') to maps from names to
     * generated names.
     */
    this.db_ = new Map();

    /** A set of used names to avoid collisions. */
    this.dbReverse_ = new Set();
  }

  addKind(kind, opt_prefix) {
    if (this.kinds_.has(kind)) throw Error('Existing kind: ' + kind);
    this.kinds_.set(kind, opt_prefix || '');
    this.db_.set(kind, new Map());
  }

  /**
   * Return a list of all known generated names of a specified kind.
   *
   * @param kind The kind of the name ('VARIABLE', 'PROCEDURE',
   *     'DEVELOPER_VARIABLE', 'DEVELOPER_PROCEDURE', etc...).
   * @returns A list of names.
   */
  getGeneratedNames(kind) {
    const typeDb = this.db_.get(kind);
    if (!typeDb) throw Error('Unknown kind: ' + kind);
    return Array.from(typeDb.keys());
  }

  /**
   * Convert a Blockly entity name to a legal exportable entity name.
   *
   * @param name The Blockly entity name (no constraints).
   * @param kind The kind of the name ('VARIABLE', 'PROCEDURE',
   *     'DEVELOPER_VARIABLE', 'DEVELOPER_PROCEDURE', etc...).
   * @returns An entity name that is legal in the exported language.
   */
  getName(name, kind) {
    const typeDb = this.db_.get(kind);
    if (!typeDb) throw Error('Unknown kind: ' + kind);
    if (typeDb.has(name)) {
      return typeDb.get(name);
    }
    const safeName = this.getDistinctName(name, kind);
    typeDb.set(name, safeName);
    return safeName;
  }

  /**
   * Convert a Blockly entity name to a legal exportable entity name.
   * Ensure that this is a new name not overlapping any previously defined name.
   * Also check against list of reserved words for the current language and
   * ensure name doesn't collide.
   *
   * @param name The Blockly entity name (no constraints).
   * @param kind The kind of the name ('VARIABLE', 'PROCEDURE',
   *     'DEVELOPER_VARIABLE', 'DEVELOPER_PROCEDURE', etc...).
   * @returns An entity name that is legal in the exported language.
   */
  getDistinctName(name, kind) {
    if (!this.kinds_.has(kind)) throw Error('Unknown kind: ' + kind);
    const prefix = this.kinds_.get(kind);
    let safeName = this.safeName_(name);
    let i = null;
    let proposedName;
    // Keep looking until there's no collision with an existing name.
    do {
      proposedName = prefix + safeName + (i ?? '');
      i = i ? i + 1 : 2;
    } while (this.dbReverse_.has(proposedName) ||
        this.reservedWords_.has(proposedName));
    this.dbReverse_.add(proposedName);
    return proposedName;
  }

  /**
   * Given a proposed entity name, generate a name that conforms to the
   * [_A-Za-z][_A-Za-z0-9]* format that most languages consider legal for
   * variable and function names.
   *
   * @param name Potentially illegal entity name.
   * @returns Safe entity name.
   */
  safeName_(name) {
    if (!name) {
      name = 'unnamed';
    } else {
      // Unfortunately names in non-latin characters will look like
      // _E9_9F_B3_E4_B9_90 which is pretty meaningless.
      // https://github.com/google/blockly/issues/1654
      name = encodeURI(name.replace(/ /g, '_')).replace(/[^\w]/g, '_');
      // Most languages don't allow names with leading numbers.
      if ('0123456789'.indexOf(name[0]) !== -1) {
        name = 'my_' + name;
      }
    }
    return name;
  }
}
