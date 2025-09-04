/* -------------------------------------------------------------------

            ⚡ Storm Software - Earthquake

 This code was released as part of the Earthquake project. Earthquake
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/earthquake/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/earthquake
 Documentation:            https://docs.stormsoftware.com/projects/earthquake/
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import type { Options } from "tsup";
import { defineConfig } from "tsup";

export const getTsupConfig = (
  options: Partial<Options> & Pick<Options, "name" | "entryPoints">
) =>
  defineConfig({
    target: "node22",
    outDir: "dist",
    format: ["cjs", "esm"],
    bundle: true,
    splitting: true,
    treeshake: true,
    keepNames: true,
    clean: true,
    sourcemap: false,
    platform: "node",
    tsconfig: "./tsconfig.json",
    dts: {
      resolve: true
    },
    onSuccess: async () => {
      // eslint-disable-next-line no-console
      console.log(`${options.name} build completed successfully!`);
    },
    ...options
  });
