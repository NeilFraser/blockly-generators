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
  /** A set of reserved words. */
  #reservedWords;

  #kinds = new Map();

  /**
   * A map from kind (e.g. name, procedure) to maps from names to generated
   * names.
   */
  #db = new Map();

  /** A set of used names to avoid collisions. */
  #dbReverse = new Set();

  /**
   * The variable map from the serialization, containing variable types.
   */
  #variableMap = null;

  /**
   * @param reservedWordsList A comma-separated string of words that are illegal
   *     for use as names in a language (e.g. 'new,if,this,...').
   * @param map A map of ID -> variable models.
   */
  constructor(reservedWordsList, map) {
    this.#reservedWords = new Set(
      reservedWordsList ? reservedWordsList.split(',') : []
    );
    this.#variableMap = map;
  }

  addKind(name, opt_prefix) {
    this.#kinds.set(name, opt_prefix || '');
    this.#db.set(name, new Map());
  }

  /**
   * Return a list of all known generated names of a specified kind.
   *
   * @param kind The kind of the name ('VARIABLE', 'PROCEDURE',
   *     'DEVELOPER_VARIABLE', 'DEVELOPER_PROCEDURE', etc...).
   * @returns A list of names.
   */
  getGeneratedNames(kind) {
    if (!this.#kinds.has(kind)) throw Error('Unknown kind: ' + kind);
    const names = this.#db.get(kind)?.keys();
    return Array.from(names || []);
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
    const typeDb = this.#db.get(kind);
    if (!typeDb) throw Error('Unknown kind: ' + kind);
    if (typeDb.has(name)) {
      return typeDb.get(name);
    }
    const safeName = this.getDistinctName(name, kind);
    typeDb.set(normalizedName, safeName);
    return safeName;
  }

  /**
   * Convert a Blockly entity name to a legal exportable entity name.
   * Ensure that this is a new name not overlapping any previously defined name.
   * Also check against list of reserved words for the current language and
   * ensure name doesn't collide.
   *
   * @param name The Blockly entity name (no constraints).
   * @param kind The type of entity in Blockly ('VARIABLE', 'PROCEDURE',
   *     'DEVELOPER_VARIABLE', etc...).
   * @returns An entity name that is legal in the exported language.
   */
  getDistinctName(name, kind) {
    if (!this.#kinds.has(kind)) throw Error('Unknown kind: ' + kind);
    const prefix = this.#kinds.get(kind);
    let safeName = this.#safeName(name);
    let i = null;
    let proposedName;
    // Keep looking until there's no collision with an existing name.
    do {
      proposedName = prefix + safeName + (i ?? '');
      i = i ? i + 1 : 2;
    } while (this.#dbReverse.has(proposedName) ||
        this.#reservedWords.has(proposedName));
    this.#dbReverse.add(proposedName);
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
  #safeName(name) {
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
