/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import javascriptGenerator from '../javascriptGenerator.js';

javascriptGenerator.block['controls_flow_statements'] = function(block) {
  // Flow statements: continue, break.
  let xfix = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    xfix += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  if (javascriptGenerator.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the break/continue is triggered.
    xfix += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_SUFFIX, block);
  }
  if (javascriptGenerator.STATEMENT_PREFIX) {
    let loop = null;
    let parentBlock = block.parent;
    while (parentBlock) {
      if (javascriptGenerator.block['controls_flow_statements'].loopTypes.has(parentBlock.type)) {
        loop = parentBlock;
        break;
      }
      parentBlock = parentBlock.parent;
    }
    if (loop && !loop.suppressPrefixSuffix) {
      // Inject loop's statement prefix here since the regular one at the end
      // of the loop will not get executed if 'continue' is triggered.
      // In the case of 'break', a prefix is needed due to the loop's suffix.
      xfix += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, loop);
    }
  }
  switch (block.fields['FLOW']) {
    case 'BREAK':
      return xfix + 'break;\n';
    case 'CONTINUE':
      return xfix + 'continue;\n';
  }
  throw Error('Unknown flow statement.');
};

javascriptGenerator.block['controls_flow_statements'].loopTypes = new Set([
  'controls_repeat',
  'controls_repeat_ext',
  'controls_forEach',
  'controls_for',
  'controls_whileUntil',
]);

javascriptGenerator.suppressPrefixSuffix.add('controls_flow_statements');
