/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import AbstractGenerator from '../core/abstractGenerator.mjs';
import Names from '../core/names.mjs';

const javascriptGenerator = new AbstractGenerator('JavaScript');
export default javascriptGenerator;

javascriptGenerator.order.ATOMIC = 0;            // 0 "" ...
javascriptGenerator.order.NEW = 1.1;             // new
javascriptGenerator.order.MEMBER = 1.2;          // . []
javascriptGenerator.order.FUNCTION_CALL = 2;     // ()
javascriptGenerator.order.INCREMENT = 3;         // ++
javascriptGenerator.order.DECREMENT = 3;         // --
javascriptGenerator.order.BITWISE_NOT = 4.1;     // ~
javascriptGenerator.order.UNARY_PLUS = 4.2;      // +
javascriptGenerator.order.UNARY_NEGATION = 4.3;  // -
javascriptGenerator.order.LOGICAL_NOT = 4.4;     // !
javascriptGenerator.order.TYPEOF = 4.5;          // typeof
javascriptGenerator.order.VOID = 4.6;            // void
javascriptGenerator.order.DELETE = 4.7;          // delete
javascriptGenerator.order.AWAIT = 4.8;           // await
javascriptGenerator.order.EXPONENTIATION = 5.0;  // **
javascriptGenerator.order.MULTIPLICATION = 5.1;  // *
javascriptGenerator.order.DIVISION = 5.2;        // /
javascriptGenerator.order.MODULUS = 5.3;         // %
javascriptGenerator.order.SUBTRACTION = 6.1;     // -
javascriptGenerator.order.ADDITION = 6.2;        // +
javascriptGenerator.order.BITWISE_SHIFT = 7;     // << >> >>>
javascriptGenerator.order.RELATIONAL = 8;        // < <= > >=
javascriptGenerator.order.IN = 8;                // in
javascriptGenerator.order.INSTANCEOF = 8;        // instanceof
javascriptGenerator.order.EQUALITY = 9;          // == != === !==
javascriptGenerator.order.BITWISE_AND = 10;      // &
javascriptGenerator.order.BITWISE_XOR = 11;      // ^
javascriptGenerator.order.BITWISE_OR = 12;       // |
javascriptGenerator.order.LOGICAL_AND = 13;      // &&
javascriptGenerator.order.LOGICAL_OR = 14;       // ||
javascriptGenerator.order.CONDITIONAL = 15;      // ?:
javascriptGenerator.order.ASSIGNMENT = 16;       // = += -= **= *= /= %= <<= >>= ...
javascriptGenerator.order.YIELD = 17;            // yield
javascriptGenerator.order.COMMA = 18;            // ,
javascriptGenerator.order.NONE = 99;             // (...)

/**
 * List of outer-inner pairings that do NOT require parentheses.
 * @type {!Array<!Array<number>>}
 */
javascriptGenerator.ORDER_OVERRIDES = [
  // (foo()).bar -> foo().bar
  // (foo())[0] -> foo()[0]
  [javascriptGenerator.order.FUNCTION_CALL, javascriptGenerator.order.MEMBER],
  // (foo())() -> foo()()
  [javascriptGenerator.order.FUNCTION_CALL, javascriptGenerator.order.FUNCTION_CALL],
  // (foo.bar).baz -> foo.bar.baz
  // (foo.bar)[0] -> foo.bar[0]
  // (foo[0]).bar -> foo[0].bar
  // (foo[0])[1] -> foo[0][1]
  [javascriptGenerator.order.MEMBER, javascriptGenerator.order.MEMBER],
  // (foo.bar)() -> foo.bar()
  // (foo[0])() -> foo[0]()
  [javascriptGenerator.order.MEMBER, javascriptGenerator.order.FUNCTION_CALL],

  // !(!foo) -> !!foo
  [javascriptGenerator.order.LOGICAL_NOT, javascriptGenerator.order.LOGICAL_NOT],
  // a * (b * c) -> a * b * c
  [javascriptGenerator.order.MULTIPLICATION, javascriptGenerator.order.MULTIPLICATION],
  // a + (b + c) -> a + b + c
  [javascriptGenerator.order.ADDITION, javascriptGenerator.order.ADDITION],
  // a && (b && c) -> a && b && c
  [javascriptGenerator.order.LOGICAL_AND, javascriptGenerator.order.LOGICAL_AND],
  // a || (b || c) -> a || b || c
  [javascriptGenerator.order.LOGICAL_OR, javascriptGenerator.order.LOGICAL_OR]
];

javascriptGenerator.oneBasedIndex = true;

/**
 * Whether the init method has been called.
 * @type {?boolean}
 */
javascriptGenerator.isInitialized = false;

// List of illegal variable names.  This is not intended to be a
// security feature.  Blockly is 100% client-side, so bypassing
// this list is trivial.  This is intended to prevent users from
// accidentally clobbering a built-in object or function.
//
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#reserved_words
javascriptGenerator.addReservedWords(
  'break,case,catch,class,const,continue,debugger,default,delete,do,else,' +
  'export,extends,false,finally,for,function,if,import,in,instanceof,new,' +
  'null,return,super,switch,this,throw,true,try,typeof,var,void,while,with,' +
  'let,static,yeild,' +
  'await,' +
  'implements,interface,package,private,protected,public,' +
  'arguments,as,async,eval,from,get,of,set,' +
  // Everything in the current environment
  // (835 items in Chrome, 104 in Node).
  Object.getOwnPropertyNames(globalThis).join(','),
);

/**
 * Initialise the database of variable names.
 * @param models Data structure to generate code from.
 */
javascriptGenerator.init = function(models) {
  // Call AbstractGenerator's init.
  Object.getPrototypeOf(this).init.call(this, models);

  this.nameDB = new Names(this.RESERVED_WORDS, models.variables);
  this.nameDB.addKind('VARIABLE');
  this.nameDB.addKind('PROCEDURE');
  this.nameDB.addKind('DEVELOPER_VARIABLE');
  this.nameDB.addKind('DEVELOPER_PROCEDURE');

  this.isInitialized = true;
};

/**
 * Prepend the generated code with variables definitons and any other definitions.
 * @param {string} code Generated code.
 * @returns {string} Completed code.
 */
javascriptGenerator.finish = function(code) {
  // Convert the definitions dictionary into a list.
  const definitions = Object.values(this.definitions);

  // Declare all of the variables.
  const variableNames = this.nameDB.getGeneratedNames('VARIABLE').concat(
                        this.nameDB.getGeneratedNames('DEVELOPER_VARIABLE'));
  if (variableNames.length) {
    definitions.push('var ' + variableNames.join(', ') + ';');
  }

  // Call AbstractGenerator's finish.
  code = Object.getPrototypeOf(this).finish.call(this, code);
  this.isInitialized = false;
  this.nameDB = null;

  return definitions.join('\n\n') + '\n\n\n' + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @returns {string} Legal line of code.
 */
javascriptGenerator.scrubNakedValue = function(line) {
  line = Object.getPrototypeOf(this).scrubNakedValue.call(this, line);
  return line + ';\n';
};

javascriptGenerator.formatComments = function(comments) {
  comments = Object.getPrototypeOf(this).formatComments.call(this, comments);
  return comments && this.prefixLines(comments, '// ');
};

/**
 * Encode a string as a properly escaped JavaScript string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @returns {string} JavaScript string.
 * @protected
 */
javascriptGenerator.quote = function(string) {
  // Can't use JSON.stringify since Google's style guide recommends
  // JS string literals use single quotes.
  string = string.replaceAll('\\', '\\\\')
               .replaceAll('\n', '\\\n')
               .replaceAll("'", "\\'");
  return `'${string}'`;
};

/**
 * Encode a string as a properly escaped multiline JavaScript string, complete
 * with quotes.
 * @param {string} string Text to encode.
 * @returns {string} JavaScript string.
 * @protected
 */
javascriptGenerator.multiline_quote = function(string) {
  // Can't use JSON.stringify since Google's style guide recommends
  // JS string literals use single quotes.
  const lines = string.split(/\n/g).map(this.quote);
  return lines.join(' + \'\\n\' +\n');
};

/**
 * Gets a property and adjusts the value while taking into account indexing.
 * @param {!Block} block The block.
 * @param {string} atId The property ID of the element to get.
 * @param {number=} opt_delta Value to add.
 * @param {boolean=} opt_negate Whether to negate the value.
 * @param {number=} opt_order The highest order acting on this value.
 * @returns {string|number}
 */
javascriptGenerator.getAdjusted = function(
    block, atId, opt_delta, opt_negate, opt_order) {
  let delta = opt_delta || 0;
  let order = opt_order || this.order.NONE;
  if (this.oneBasedIndex) {
    delta--;
  }
  const defaultAtIndex = this.oneBasedIndex ? '1' : '0';

  let innerOrder;
  let outerOrder = order;
  if (delta > 0) {
    outerOrder = this.order.ADDITION;
    innerOrder = this.order.ADDITION;
  } else if (delta < 0) {
    outerOrder = this.order.SUBTRACTION;
    innerOrder = this.order.SUBTRACTION;
  } else if (opt_negate) {
    outerOrder = this.order.UNARY_NEGATION;
    innerOrder = this.order.UNARY_NEGATION;
  }

  let at = this.valueToCode(block, atId, outerOrder) || defaultAtIndex;

  if (/^\s*-?\d+(\.\d+)?\s*$/.test(at)) {
    // If the index is a naked number, adjust it right now.
    at = Number(at) + delta;
    if (opt_negate) {
      at = -at;
    }
  } else {
    // If the index is dynamic, adjust it in code.
    if (delta > 0) {
      at += ' + ' + delta;
    } else if (delta < 0) {
      at += ' - ' + -delta;
    }
    if (opt_negate) {
      at = delta ? `-(${at})` : '-' + at;
    }
    innerOrder = Math.floor(innerOrder);
    order = Math.floor(order);
    if (innerOrder && order >= innerOrder) {
      at = `(${at})`;
    }
  }
  return at;
};
