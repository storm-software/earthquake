/* -------------------------------------------------------------------

                   ⚡ Storm Software - Earthquake

 This code was released as part of the Earthquake project. Earthquake
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/earthquake.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/earthquake
 Documentation:            https://docs.stormsoftware.com/projects/earthquake
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import type { Node, Program } from "estree";
import { walk } from "estree-walker";
import MagicString from "magic-string";
import { analyze } from "periscopic";

export function transformCjsToEsm(
  code: string,
  ast: Program
): { output: MagicString } {
  const output = new MagicString(code);
  const analyzed = analyze(ast);

  const parentNodes: Node[] = [];
  const hoistedCodes: string[] = [];
  let hoistIndex = 0;
  walk(ast, {
    enter(node) {
      parentNodes.push(node);
      if (
        node.type === "CallExpression" &&
        node.callee.type === "Identifier" &&
        node.callee.name === "require" &&
        node.arguments.length === 1
      ) {
        let isTopLevel = true;
        for (const parent of parentNodes) {
          if (
            parent.type === "FunctionExpression" ||
            parent.type === "FunctionDeclaration" ||
            parent.type === "ArrowFunctionExpression"
          ) {
            isTopLevel = false;
          }
          // skip locally declared `require`
          const scope = analyzed.map.get(parent);
          if (scope && scope.declarations.has("require")) {
            return;
          }
        }

        if (isTopLevel) {
          // top-level scope `require` to dynamic import
          // (this allows handling react development/production re-export within top-level if branch)
          output.update(node.start, node.callee.end, "(await import");
          output.appendRight(node.end, ")");
        } else {
          // hoist non top-level `require` to top-level
          const hoisted = `__cjs_to_esm_hoist_${hoistIndex}`;
          const imported = code.slice(
            node.arguments[0]!.start,
            node.arguments[0]!.end
          );
          hoistedCodes.push(`const ${hoisted} = await import(${imported});\n`);
          output.update(node.start, node.end, hoisted);
          hoistIndex++;
        }
      }
    },
    leave() {
      parentNodes.pop()!;
    }
  });
  for (const hoisted of hoistedCodes.reverse()) {
    output.prepend(hoisted);
  }
  output.prepend(`const exports = {}; const module = { exports };\n`);
  return { output };
}
