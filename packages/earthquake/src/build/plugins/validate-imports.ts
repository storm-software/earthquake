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

import type { Plugin } from "powerlines/types/plugin";
import type { EarthquakePluginContext } from "../types/powerlines";

/**
 * A Powerlines plugin to validate imports based on the current environment.
 *
 * @remarks
 * It prevents importing 'client-only' modules in server environments and 'server-only' modules in client environments.
 *
 * @see https://github.com/vercel/next.js/blob/90f564d376153fe0b5808eab7b83665ee5e08aaf/packages/next/src/build/webpack-config.ts#L1249-L1280
 * @see https://github.com/pcattori/vite-env-only/blob/68a0cc8546b9a37c181c0b0a025eb9b62dbedd09/src/deny-imports.ts
 * @see https://github.com/sveltejs/kit/blob/84298477a014ec471839adf7a4448d91bc7949e4/packages/kit/src/exports/vite/index.js#L513
 *
 * @return A Powerlines plugin.
 */
export function validateImports<
  TContext extends EarthquakePluginContext = EarthquakePluginContext
>(): Plugin<TContext> {
  return {
    name: "earthquake:validate-imports",
    types(code: string) {
      return `${code}

declare module "earthquake:empty" {
  const empty: {};
  export = empty;
}

`;
    },
    resolveId: {
      order: "pre",
      async handler(source, importer, options) {
        // optimizer is not aware of server/client boundary so skip
        if ("scan" in options && options.scan) {
          return;
        }

        // Validate client-only imports in server environments
        if (source === "client-only") {
          if (this.environment.name === "rsc") {
            throw new Error(
              `'client-only' cannot be imported in server build (importer: '${
                importer ?? "unknown"
              }', environment: ${this.environment.name})`
            );
          }

          return { id: "earthquake:empty", moduleSideEffects: false };
        }

        if (source === "server-only") {
          if (this.environment.name !== "rsc") {
            throw new Error(
              `'server-only' cannot be imported in client build (importer: '${
                importer ?? "unknown"
              }', environment: ${this.environment.name})`
            );
          }

          return { id: "earthquake:empty", moduleSideEffects: false };
        }

        // Ensure all code paths return a value
        return undefined;
      }
    },
    load: {
      filter: {
        id: "earthquake:empty"
      },
      handler(id) {
        return { id, code: `export {}` };
      }
    }
  };
}
