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
import type MagicString from "magic-string";
import { transformHoistInlineDirective } from "./hoist";
import { hasDirective } from "./utils";
import { transformWrapExport } from "./wrap-export";

// TODO
// source map for `options.runtime` (registerServerReference) call
// needs to match original position.
export function transformServerActionServer(
  input: string,
  ast: Program,
  options: {
    runtime: (value: string, name: string) => string;
    rejectNonAsyncFunction?: boolean;
    encode?: (value: string) => string;
    decode?: (value: string) => string;
  }
):
  | {
      exportNames: string[];
      output: MagicString;
    }
  | {
      output: MagicString;
      names: string[];
    } {
  // TODO: unify (generalize transformHoistInlineDirective to support top leve directive case)
  if (hasDirective(ast.body, "use server")) {
    return transformWrapExport(input, ast, options);
  }
  return transformHoistInlineDirective(input, ast, {
    ...options,
    directive: "use server"
  });
}
