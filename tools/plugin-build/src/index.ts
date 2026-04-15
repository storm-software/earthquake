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

import powerlines from "@powerlines/plugin-plugin";
import type { Plugin } from "powerlines";
import type { InternalBuildPluginContext } from "./types/plugin";

export * from "./types";

/**
 * The internal Earthquake build Powerlines plugin.
 *
 * @internal
 */
export const plugin = <
  TContext extends InternalBuildPluginContext = InternalBuildPluginContext
>(): Plugin<TContext>[] => {
  return [
    powerlines(),
    {
      name: "internal-build"
    }
  ] as Plugin<TContext>[];
};

export default plugin;
