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
import MagicString from "magic-string";
// eslint-disable-next-line camelcase
import { extract_names } from "periscopic";
import { hasDirective } from "./utils";

export interface TransformProxyExportOptions {
  /** Required for source map and `keep` options */
  code?: string;
  runtime: (name: string, meta?: { value: string }) => string;
  ignoreExportAllDeclaration?: boolean;
  rejectNonAsyncFunction?: boolean;
  /**
   * escape hatch for Waku's `allowServer`
   *
   * @defaultValue false
   */
  keep?: boolean;
}

export function transformDirectiveProxyExport(
  ast: Program,
  options: {
    directive: string;
  } & TransformProxyExportOptions
):
  | {
      exportNames: string[];
      output: MagicString;
    }
  | undefined {
  if (!hasDirective(ast.body, options.directive)) {
    return;
  }
  return transformProxyExport(ast, options);
}

export function transformProxyExport(
  ast: Program,
  options: TransformProxyExportOptions
): {
  exportNames: string[];
  output: MagicString;
} {
  if (options.keep && typeof options.code !== "string") {
    throw new Error("`keep` option requires `code`");
  }
  const output = new MagicString(options.code ?? " ".repeat(ast.end));
  const exportNames: string[] = [];

  function createExport(node: Node, names: string[]) {
    exportNames.push(...names);
    const newCode = names
      .map(
        name =>
          `${
            name === "default" ? `export default` : `export const ${name} =`
          } /* #__PURE__ */ ${options.runtime(name)};\n`
      )
      .join("");
    output.update(node.start, node.end, newCode);
  }

  function validateNonAsyncFunction(node: Node, ok?: boolean) {
    if (options.rejectNonAsyncFunction && !ok) {
      throw Object.assign(new Error(`unsupported non async function`), {
        pos: node.start
      });
    }
  }

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
          validateNonAsyncFunction(
            node,
            node.declaration.type === "FunctionDeclaration" &&
              node.declaration.async
          );
          createExport(node, [node.declaration.id.name]);
        } else if (node.declaration.type === "VariableDeclaration") {
          /**
           * export const foo = 1, bar = 2
           */
          validateNonAsyncFunction(
            node,
            node.declaration.declarations.every(
              decl =>
                decl.init?.type === "ArrowFunctionExpression" && decl.init.async
            )
          );
          if (options.keep && options.code) {
            if (node.declaration.declarations.length === 1) {
              const decl = node.declaration.declarations[0]!;
              if (decl.id.type === "Identifier" && decl.init) {
                const name = decl.id.name;
                const value = options.code.slice(
                  decl.init.start,
                  decl.init.end
                );
                const newCode = `export const ${name} = /* #__PURE__ */ ${options.runtime(
                  name,
                  { value }
                )};`;
                output.update(node.start, node.end, newCode);
                exportNames.push(name);
                continue;
              }
            }
          }
          const names = node.declaration.declarations.flatMap(decl =>
            extract_names(decl.id)
          );
          createExport(node, names);
        } else {
          node.declaration satisfies never;
        }
      } else {
        /**
         * export \{ foo, bar as car \} from './foo'
         * export \{ foo, bar as car \}
         */
        const names: string[] = [];
        for (const spec of node.specifiers) {
          if (spec.exported.type !== "Identifier") {
            throw new Error("Unsupported export specifier");
          }

          names.push(spec.exported.name);
        }
        createExport(node, names);
      }
      continue;
    }

    /**
     * export * from './foo'
     */
    if (
      !options.ignoreExportAllDeclaration &&
      node.type === "ExportAllDeclaration"
    ) {
      throw new Error("Unsupported ExportAllDeclaration");
    }

    /**
     * export default function foo() \{\}
     * export default class Foo \{\}
     * export default () =\> \{\}
     */
    if (node.type === "ExportDefaultDeclaration") {
      validateNonAsyncFunction(
        node,
        node.declaration.type === "Identifier" ||
          (node.declaration.type === "FunctionDeclaration" &&
            node.declaration.async)
      );
      createExport(node, ["default"]);
      continue;
    }

    if (options.keep) continue;

    // remove all other nodes
    output.remove(node.start, node.end);
  }

  return { exportNames, output };
}
