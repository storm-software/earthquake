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

import PowerlinesAPI from "powerlines";
import type { UserConfig } from "../config/types/user-config";

export { plugin } from "./plugin";
export * from "./types";

/**
 * Initialize an Earthquake API instance
 *
 * @param workspaceRoot - The directory of the underlying workspace the Earthquake project exists in
 * @param config - An object containing the configuration required to run Earthquake tasks.
 * @returns A new instance of the Earthquake API
 */
export async function createApi(workspaceRoot: string, config: UserConfig) {
  return PowerlinesAPI.from(workspaceRoot, config);
}
