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

import type { Plugin } from "vite";

export function patchReactServerDOMWebpackPlugin(): Plugin[] {
  return [
    {
      name: "earthquake:patch-react-server-dom",
      transform(originalCode, _id, _options) {
        let code = originalCode;
        if (code.includes("__webpack_require__.u")) {
          // avoid accessing `__webpack_require__` on import side effect
          // https://github.com/facebook/react/blob/a9bbe34622885ef5667d33236d580fe7321c0d8b/packages/react-server-dom-webpack/src/client/ReactFlightClientConfigBundlerWebpackBrowser.js#L16-L17
          code = code.replaceAll("__webpack_require__.u", "({}).u");
        }

        // the existence of `__webpack_require__` global can break some packages
        // https://github.com/TooTallNate/node-bindings/blob/c8033dcfc04c34397384e23f7399a30e6c13830d/bindings.js#L90-L94
        if (code.includes("__webpack_require__")) {
          code = code.replaceAll(
            "__webpack_require__",
            "__earthquake_require__"
          );
        }

        if (code !== originalCode) {
          return { code, map: null };
        }

        return null;
      }
    },
    {
      // commonjsOptions needs to be tweaked when this is a linked dep
      // since otherwise vendored cjs doesn't work.
      name: "earthquake:workaround-linked-dep",
      apply: () => !import.meta.url.includes("/node_modules/"),
      configEnvironment() {
        return {
          build: {
            commonjsOptions: {
              include: [/\/node_modules\//, /\/vendor\/react-server-dom\//]
            }
          }
        };
      }
    }
  ];
}
