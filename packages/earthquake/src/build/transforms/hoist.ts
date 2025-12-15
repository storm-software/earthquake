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
import { walk } from "estree-walker";
import MagicString from "magic-string";
import { analyze } from "periscopic";

const exactRegex = (s: string): RegExp =>
  new RegExp(`^${s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}$`);

export function transformHoistInlineDirective(
  input: string,
  ast: Program,
  {
    runtime,
    rejectNonAsyncFunction,
    ...options
  }: {
    runtime: (
      value: string,
      name: string,
      meta: { directiveMatch: RegExpMatchArray }
    ) => string;
    directive: string | RegExp;
    rejectNonAsyncFunction?: boolean;
    encode?: (value: string) => string;
    decode?: (value: string) => string;
    noExport?: boolean;
  }
): {
  output: MagicString;
  names: string[];
} {
  const output = new MagicString(input);
  const directive =
    typeof options.directive === "string"
      ? exactRegex(options.directive)
      : options.directive;

  // re-export somehow confuses periscopic scopes so remove them before analysis
  walk(ast, {
    enter(node) {
      if (node.type === "ExportAllDeclaration") {
        this.remove();
      }
      if (node.type === "ExportNamedDeclaration" && !node.declaration) {
        this.remove();
      }
    }
  });

  const analyzed = analyze(ast);
  const names: string[] = [];

  walk(ast, {
    enter(node, parent) {
      if (
        (node.type === "FunctionExpression" ||
          node.type === "FunctionDeclaration" ||
          node.type === "ArrowFunctionExpression") &&
        node.body.type === "BlockStatement"
      ) {
        const match = matchDirective(node.body.body, directive);
        if (!match) return;
        if (!node.async && rejectNonAsyncFunction) {
          throw Object.assign(
            new Error(`"${directive}" doesn't allow non async function`),
            {
              pos: node.start
            }
          );
        }

        const scope = analyzed.map.get(node);
        if (!scope) {
          throw new Error("Scope not found");
        }

        const declName = node.type === "FunctionDeclaration" && node.id.name;
        const originalName =
          declName ||
          (parent?.type === "VariableDeclarator" &&
            parent.id.type === "Identifier" &&
            parent.id.name) ||
          "anonymous_server_function";

        // bind variables which are neither global nor in own scope
        const bindVars = [...scope.references].filter(ref => {
          // declared function itself is included as reference
          if (ref === declName) {
            return false;
          }
          const owner = scope.find_owner(ref);

          return owner && owner !== scope && owner !== analyzed.scope;
        });
        let newParams = [
          ...bindVars,
          ...node.params.map(n => input.slice(n.start, n.end))
        ].join(", ");
        if (bindVars.length > 0 && options.decode) {
          newParams = [
            "$$hoist_encoded",
            ...node.params.map(n => input.slice(n.start, n.end))
          ].join(", ");
          output.appendLeft(
            node.body.body[0]!.start,
            `const [${bindVars.join(",")}] = ${options.decode(
              "$$hoist_encoded"
            )};\n`
          );
        }

        // append a new `FunctionDeclaration` at the end
        const newName = `$$hoist_${names.length}${originalName ? `_${originalName}` : ""}`;
        names.push(newName);
        output.update(
          node.start,
          node.body.start,
          `\n;${options.noExport ? "" : "export "}${
            node.async ? "async " : ""
          }function ${newName}(${newParams}) `
        );
        output.appendLeft(
          node.end,
          `;\n/* #__PURE__ */ Object.defineProperty(${newName}, "name", { value: ${JSON.stringify(
            originalName
          )} });\n`
        );
        output.move(node.start, node.end, input.length);

        // replace original declaration with action register + bind
        let newCode = `/* #__PURE__ */ ${runtime(newName, newName, {
          directiveMatch: match
        })}`;
        if (bindVars.length > 0) {
          const bindArgs = options.encode
            ? options.encode(`[${bindVars.join(", ")}]`)
            : bindVars.join(", ");
          newCode = `${newCode}.bind(null, ${bindArgs})`;
        }
        if (declName) {
          newCode = `const ${declName} = ${newCode};`;
          if (parent?.type === "ExportDefaultDeclaration") {
            output.remove(parent.start, node.start);
            newCode = `${newCode}\nexport default ${declName};`;
          }
        }
        output.appendLeft(node.start, newCode);
      }
    }
  });

  return {
    output,
    names
  };
}

function matchDirective(
  body: Program["body"],
  directive: RegExp
): RegExpMatchArray | undefined {
  for (const stable of body) {
    if (
      stable.type === "ExpressionStatement" &&
      stable.expression.type === "Literal" &&
      typeof stable.expression.value === "string"
    ) {
      const match = stable.expression.value.match(directive);
      if (match) {
        return match;
      }
    }
  }

  return undefined;
}
