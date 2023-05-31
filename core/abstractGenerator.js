/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import parseJson from './parseJson.js';

export default class AbstractGenerator {
  name;

  /**
   * Arbitrary code to inject into locations that risk causing infinite loops.
   * Any instances of '%1' will be replaced by the block ID that failed.
   * E.g. `  checkTimeout(%1);\n`
   */
  INFINITE_LOOP_TRAP = null;

  /**
   * Arbitrary code to inject before every statement.
   * Any instances of '%1' will be replaced by the block ID of the statement.
   * E.g. `highlight(%1);\n`
   */
  STATEMENT_PREFIX = null;

  /**
   * Arbitrary code to inject after every statement.
   * Any instances of '%1' will be replaced by the block ID of the statement.
   * E.g. `highlight(%1);\n`
   */
  STATEMENT_SUFFIX = null;

  /** Set of block types which don't want statement prefixes or suffixes. */
  suppressPrefixSuffix = new Set();

  /**
   * The method of indenting.  Defaults to two spaces, but language generators
   * may override this to increase indent or change to tabs.
   */
  INDENT = '  ';

  /**
   * Maximum length for a comment before wrapping.  Does not account for
   * indenting level.
   */
  COMMENT_WRAP = 60;

  /** List of outer-inner pairings that do NOT require parentheses. */
  ORDER_OVERRIDES = [];

  /** Comma-separated list of reserved words. */
  RESERVED_WORDS = '';

  block = Object.create(null);
  order = Object.create(null);

  /**
   * Whether the init method has been called.
   * Generators that set this flag to false after creation and true in init
   * will cause blockToCode to emit a warning if the generator has not been
   * initialized. If this flag is untouched, it will have no effect.
   */
  isInitialized = null;

  /** A dictionary of definitions to be printed before the code. */
  definitions = null;

  /** A database of variable and procedure names. */
  nameDB = null;

  /**
   * Angle away from the horizontal to sweep for blocks.  Order of execution is
   * generally top to bottom, but a small angle changes the scan to give a bit
   * of a left to right bias (reversed in RTL).  Units are in degrees. See:
   * https://tvtropes.org/pmwiki/pmwiki.php/Main/DiagonalBilling
   */
  SCAN_ANGLE = 3;
  #scanSin

  commentStack = null;

  /**
   * This is used as a placeholder in functions defined using
   * AbstractGenerator.provideFunction.  It must not be legal code that could
   * legitimately appear in a developer-provided function definition
   * (or comment), and it must not confuse the regular expression parser.
   */
  FUNCTION_NAME_PLACEHOLDER = '{leCUI8hutHZI4480Dc}';
  #FUNCTION_NAME_PLACEHOLDER_REGEXP = new RegExp(
        this.FUNCTION_NAME_PLACEHOLDER_, 'g');

  constructor(name) {
    this.name = name;
  }

  /**
   * Generate code for all blocks in the JSON to this generator's language.
   *
   * @param json Serialization to generate code from.
   * @returns Generated code.
   */
  toCode(json) {
    const models = parseJson(json);
    this.init(models);
    // Cache the scan offset.
    this.scanSin = Math.sin(this.SCAN_ANGLE / 180 * Math.PI);
    models.blocks.sort(this.sortBlockFunc);

    const code = [];
    // Iterate through the top blocks.
    for (const block of models.blocks) {
      this.commentStack.push([]);
      let line = this.blockToCode(block);
      if (Array.isArray(line)) {
        // Value blocks return tuples of code and operator order.
        // Top-level blocks don't care about operator order.
        line = line[0];
        if (line) {
          // This block is a naked value.  Ask the language's code generator if
          // it wants to append a semicolon, or something.
          line = this.scrubNakedValue(line);
          line = this.addPrefixSuffix(line, block, '');
        }
      }
      const comments = this.commentStack.pop();
      if (line) {
        code.push(this.formatComments(comments) + line);
      }
    }
    // Blank line between each section.
    let codeString = code.join('\n');
    codeString = this.finish(codeString);
    // Final scrubbing of whitespace.
    return codeString.replace(/^\s+\n/, '')        // Leading blank lines.
                     .replace(/\n\s+$/, '\n')      // Trailing blank lines.
                     .replace(/[ \t]+\n/g, '\n');  // Indented empty lines.
  }

  /**
   * Prepend a common prefix onto each line of code.
   * Intended for indenting code or adding comment markers.
   *
   * @param text {string} The lines of code.
   * @param prefix {string} The common prefix.
   * @returns {string} The prefixed lines of code.
   */
  prefixLines(text, prefix) {
    return prefix + text.replace(/(?!\n$)\n/g, '\n' + prefix);
  }

  /**
   * Generate code for the specified block (and attached blocks).
   * The generator must be initialized before calling this function.
   *
   * @param block The block to generate code for.
   * @param opt_thisOnly True to generate code for only this statement.
   * @returns For statement blocks, the generated code.
   *     For value blocks, an array containing the generated code and an
   * operator order value.  Returns '' if block is null.
   */
  blockToCode(block, opt_thisOnly) {
    if (this.isInitialized === false) {
      console.warn(
        'Generator init was not called before blockToCode was called'
      );
    }
    if (!block) {
      return '';
    }
    if (block.enabled === false) {
      // Skip past this block if it is disabled.
      return opt_thisOnly ? '' : this.blockToCode(block.next);
    }

    const func = this.block[block.type];
    if (typeof func !== 'function') {
      throw Error(`Language "${this.name}" does not know how to generate ` +
          `code for block type "${block.type}"`);
    }
    if (block.comment) {
      this.commentStack[this.commentStack.length - 1].push(block.comment);
    }
    let code = func(block);
    let nextCode = opt_thisOnly ? '' : this.next(block);
    if (Array.isArray(code)) {
      return [code[0] + nextCode, code[1]];
    } else if (typeof code === 'string') {
      code = this.addPrefixSuffix(code, block, '');
      return code + nextCode;
    } else if (code === null) {
      // Block has handled code generation itself.
      return nextCode;
    }
    throw SyntaxError('Invalid code generated: ' + code);
  }

  /**
   * Generate code representing the specified value input.
   *
   * @param block The block containing the input.
   * @param name The name of the input.
   * @param outerOrder The maximum binding strength (minimum order value) of any
   *     operators adjacent to "block".
   * @returns Generated code or '' if no blocks are connected or the specified
   *     input does not exist.
   */
  valueToCode(block, name, outerOrder) {
    if (isNaN(outerOrder)) {
      throw TypeError('Expecting valid order from block: ' + block.type);
    }
    const targetBlock = block.inputs[name];
    if (!targetBlock) {
      return '';
    }
    const tuple = this.blockToCode(targetBlock);
    if (tuple === '') {
      // Disabled block.
      return '';
    }
    // Value blocks must return code and order of operations info.
    // Statement blocks must only return code.
    if (!Array.isArray(tuple)) {
      throw TypeError(
          `Expecting tuple from value block: ${targetBlock.type} See ` +
          `developers.google.com/blockly/guides/create-custom-blocks/generating-code ` +
          `for more information`);
    }
    let code = tuple[0];
    const innerOrder = tuple[1];
    if (isNaN(innerOrder)) {
      throw TypeError(
          'Expecting valid order from value block: ' + targetBlock.type);
    }
    if (!code) {
      return '';
    }

    // Add parentheses if needed.
    let parensNeeded = false;
    const outerOrderClass = Math.floor(outerOrder);
    const innerOrderClass = Math.floor(innerOrder);
    if (outerOrderClass <= innerOrderClass) {
      if (outerOrderClass === innerOrderClass &&
          (outerOrderClass === 0 || outerOrderClass === 99)) {
        // Don't generate parens around NONE-NONE and ATOMIC-ATOMIC pairs.
        // 0 is the atomic order, 99 is the none order.  No parentheses needed.
        // In all known languages multiple such code blocks are not order
        // sensitive.  In fact in Python ('a' 'b') 'c' would fail.
      } else {
        // The operators outside this code are stronger than the operators
        // inside this code.  To prevent the code from being pulled apart,
        // wrap the code in parentheses.
        parensNeeded = true;
        // Check for special exceptions.
        for (let i = 0; i < this.ORDER_OVERRIDES.length; i++) {
          if (this.ORDER_OVERRIDES[i][0] === outerOrder &&
              this.ORDER_OVERRIDES[i][1] === innerOrder) {
            parensNeeded = false;
            break;
          }
        }
      }
    }
    if (parensNeeded) {
      // Technically, this should be handled on a language-by-language basis.
      // However all known (sane) languages use parentheses for grouping.
      code = `(${code})`;
    }
    return code;
  }

  /**
   * Generate a code string representing the blocks attached to the named
   * statement input. Indent the code.
   * This is mainly used in generators. When trying to generate code to evaluate
   * look at using workspaceToCode or blockToCode.
   *
   * @param block The block containing the input.
   * @param name The name of the input.
   * @returns Generated code or '' if no blocks are connected.
   */
  statementToCode(block, name) {
    const targetBlock = block.inputs[name];
    this.commentStack.push([]);
    let code = this.blockToCode(targetBlock);
    // Value blocks must return code and order of operations info.
    // Statement blocks must only return code.
    if (typeof code !== 'string') {
      throw TypeError(
          'Expecting code from statement block: ' + targetBlock?.type);
    }
    const comments = this.commentStack.pop();
    if (code) {
      code = this.formatComments(comments) + code;
      code = this.prefixLines(code, this.INDENT);
    }
    return code;
  }

  /**
   * Add an infinite loop trap to the contents of a loop.
   * Add statement suffix at the start of the loop block (right after the loop
   * statement executes), and a statement prefix to the end of the loop block
   * (right before the loop statement executes).
   *
   * @param branch Code for loop contents.
   * @param block Enclosing block.
   * @returns Loop contents, with infinite loop trap added.
   */
  addLoopTrap(branch, block) {
    if (this.INFINITE_LOOP_TRAP) {
      branch = this.prefixLines(
          this.injectId(this.INFINITE_LOOP_TRAP, block), this.INDENT) + branch;
    }
    return this.addPrefixSuffix(branch, block, this.INDENT);
  }

  /**
   * Inject a block ID into a message to replace '%1'.
   * Used for STATEMENT_PREFIX, STATEMENT_SUFFIX, and INFINITE_LOOP_TRAP.
   *
   * @param msg Code snippet with '%1'.
   * @param block Block which has an ID.
   * @returns Code snippet with ID.
   */
  injectId(msg, block) {
    // 'x'.replace(/x/g, `'abc$'`) -> "'abc"
    // See https://github.com/google/blockly/issues/251
    const id = block.id.replace(/\$/g, '$$$$');
    return msg.replace(/%1/g, `'${id}'`);
  }

  /**
   * Add one or more words to the list of reserved words for this language.
   *
   * @param words Comma-separated list of words to add to the list.
   *     No spaces.  Duplicates are ok.
   */
  addReservedWords(words) {
    this.RESERVED_WORDS += words + ',';
  }

  /**
   * Define a developer-defined function (not a user-defined procedure) to be
   * included in the generated code.  Used for creating private helper
   * functions. The first time this is called with a given desiredName, the code
   * is saved and an actual name is generated.  Subsequent calls with the same
   * desiredName have no effect but have the same return value.
   *
   * It is up to the caller to make sure the same desiredName is not
   * used for different helper functions (e.g. use "colourRandom" and
   * "listRandom", not "random").  There is no danger of colliding with reserved
   * words, or user-defined variable or procedure names.
   *
   * The code gets output when CodeGenerator.finish() is called.
   *
   * @param desiredName The desired name of the function (e.g. mathIsPrime).
   * @param code A list of statements or one multi-line code string.  Use '  '
   *     for indents (they will be replaced).
   * @returns The actual name of the new function.  This may differ from
   *     desiredName if the former has already been taken by the user.
   */
  provideFunction(desiredName, code) {
    functionName =
        this.nameDB.getName(desiredName, this.NameKind.DEVELOPER_PROCEDURE);
    if (!this.definitions[functionName]) {
      if (Array.isArray(code)) {
        code = code.join('\n');
      }
      let codeText = code.trim().replace(
          this.FUNCTION_NAME_PLACEHOLDER_REGEXP, functionName);
      // Change all '  ' indents into the desired indent.
      // To avoid an infinite loop of replacements, change all indents to '\0'
      // character first, then replace them all with the indent.
      // We are assuming that no provided functions contain a literal null char.
      if (codeText.includes('\0')) {
        throw new Error('Null character found in ' + desiredName);
      }
      let oldCodeText;
      while (oldCodeText !== codeText) {
        oldCodeText = codeText;
        codeText = codeText.replace(/^(( {2})*) {2}/gm, '$1\0');
      }
      codeText = codeText.replace(/\0/g, this.INDENT);
      this.definitions[functionName] = codeText;
    }
    return functionName;
  }

  /**
   * Hook for code to run before code generation starts.
   * Subclasses may override this, e.g. to initialise the database of variable
   * names.
   *
   * @param _models Data structure to generate code from.
   */
  init(_models) {
    this.definitions = Object.create(null);
    this.commentStack = [];
  }

  /**
   * Common tasks for generating code from blocks.  This is called from
   * blockToCode and is called on every block, not just top level blocks.
   * Subclasses may override this, e.g. to generate code for statements
   * following the block, or to handle comments for the specified block and any
   * connected value blocks.
   *
   * @param block The current block.
   * @returns Code with comments and subsequent blocks added.
   */
  next(block) {
    const nextBlock = block.next;
    if (nextBlock) {
      this.commentStack.push([]);
      const nextCode = this.blockToCode(nextBlock);
      const comments = this.commentStack.pop();
      if (nextCode) {
        return this.formatComments(comments) + nextCode;
      }
    }
    return '';
  }

  addPrefixSuffix(code, block, indent) {
    if (this.STATEMENT_PREFIX && !this.suppressPrefixSuffix.has(block.type)) {
      const
      code = this.prefixLines(
          this.injectId(this.STATEMENT_PREFIX, block), indent) + code;
    }
    if (this.STATEMENT_SUFFIX && !this.suppressPrefixSuffix.has(block.type)) {
      code = code +
          this.prefixLines(this.injectId(this.STATEMENT_SUFFIX, block), indent);
    }
    return code;
  }

  /**
   * Hook for code to run at end of code generation.
   * Subclasses may override this, e.g. to prepend the generated code with
   * import statements or variable definitions.
   *
   * @param code Generated code.
   * @returns Completed code.
   */
  finish(code) {
    // Optionally override
    // Clean up temporary data.
    this.definitions = null;
    return code;
  }

  /**
   * Naked values are top-level blocks with outputs that aren't plugged into
   * anything.
   * Subclasses may override this, e.g. if their language does not allow
   * naked values.
   *
   * @param line Line of generated code.
   * @returns Legal line of code.
   */
  scrubNakedValue(line) {
    return line;
  }

  /**
   * Compare function for sorting blocks by position;
   *    top to bottom (with slight LTR or RTL bias).
   *
   * @param a The first block to compare.
   * @param b The second block to compare.
   * @returns The comparison value.
   *     This tells Array.sort() how to change object a's index.
   */
  #sortBlockFunc(a, b) {
    return a.y + this.scanSin * a.x - (b.y + this.scanSin * b.x);
  }

  formatComments(comments) {
    if (!comments || !comments.length) return '';
    for (let i = 0; i < comments.length; i++) {
      comments[i] = this.wrap(comments[i]);
    }
    return comments.join('\n') + '\n';
  }

  #wrap(text, maxLength) {
    const words = text.split(' ');
    let currentLineLength = 0;
    let wrappedText = '';

    for (const word of words) {
      const wordLength = word.length;
      if (currentLineLength + wordLength > maxLength) {
        wrappedText += '\n' + word + ' ';
        currentLineLength = 0;
      } else {
        wrappedText += word + ' ';
      }
      currentLineLength += wordLength + 1;
    }

    return wrappedText.trim();
  }
}
