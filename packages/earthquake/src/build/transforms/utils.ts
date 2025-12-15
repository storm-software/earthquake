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

import type { Program } from "estree";
// eslint-disable-next-line camelcase
import { extract_names } from "periscopic";

export function hasDirective(
  body: Program["body"],
  directive: string
): boolean {
  return !!body.find(
    stmt =>
      stmt.type === "ExpressionStatement" &&
      stmt.expression.type === "Literal" &&
      typeof stmt.expression.value === "string" &&
      stmt.expression.value === directive
  );
}

export function getExportNames(
  ast: Program,
  options: {
    ignoreExportAllDeclaration?: boolean;
  }
): {
  exportNames: string[];
} {
  const exportNames: string[] = [];

  for (const node of ast.body) {
    if (node.type === "ExportNamedDeclaration") {
      if (node.declaration) {
        if (
          node.declaration.type === "FunctionDeclaration" ||
          node.declaration.type === "ClassDeclaration"
        ) {
          /**
           * export function foo() \{\}
           */
          exportNames.push(node.declaration.id.name);
        } else if (node.declaration.type === "VariableDeclaration") {
          /**
           * export const foo = 1, bar = 2
           */
          for (const decl of node.declaration.declarations) {
            exportNames.push(...extract_names(decl.id));
          }
        } else {
          node.declaration satisfies never;
        }
      } else {
        /**
         * export \{ foo, bar as car \} from './foo'
         * export \{ foo, bar as car \}
         */
        for (const spec of node.specifiers) {
          if (spec.exported.type !== "Identifier") {
            throw new Error("Unsupported export specifier");
          }

          exportNames.push(spec.exported.name);
        }
      }
    }

    /**
     * export * from './foo'
     */
    if (
      !options.ignoreExportAllDeclaration &&
      node.type === "ExportAllDeclaration"
    ) {
      throw new Error("unsupported ExportAllDeclaration");
    }

    /**
     * export default function foo() \{\}
     * export default class Foo \{\}
     * export default () =\> \{\}
     */
    if (node.type === "ExportDefaultDeclaration") {
      exportNames.push("default");
    }
  }

  return { exportNames };
}
