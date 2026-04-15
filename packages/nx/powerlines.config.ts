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

import tsdown from "@powerlines/plugin-tsdown";
import untyped from "@powerlines/plugin-untyped";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  name: "nx",
  input: [
    "./index.ts",
    // "./executors.ts",
    // "./generators.ts",
    "./src/plugin/index.ts",
    "./src/executors/*/executor.ts",
    "./src/executors/*/untyped.ts",
    "./src/generators/*/generator.ts",
    "./src/generators/*/untyped.ts"
  ],
  plugins: [untyped(), tsdown()],
  clean: false,
  skipNodeModulesBundle: true
});
