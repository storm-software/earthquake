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

/* eslint-disable camelcase */

import { isFunction } from "@stryke/type-checks/is-function";
import type { Plugin } from "powerlines/types/plugin";
import type { UNSTABLE_EarthquakePlugin } from "../types/internal";
import type { EarthquakePluginContext } from "../types/powerlines";

/**
 * A type-check function to determine if the user provided plugin is an earthquake plugin with earthquake specific hook functions
 *
 * @param plugin - The plugin object to type-check
 * @returns An indicator specifying if the user provided plugin is an earthquake plugin with earthquake specific hook functions
 */
export function isEarthquakePlugin<TContext extends EarthquakePluginContext>(
  plugin: Plugin<TContext>
): plugin is UNSTABLE_EarthquakePlugin<TContext> {
  return isFunction(plugin.api?.layout);
}
