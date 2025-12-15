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

import type { UserConfig as PowerlinesUserConfig } from "powerlines/types/config";

/**
 * The user-provided configuration for Earthquake.
 */
export interface UserConfig {
  /**
   * The root directory of the Earthquake project.
   */
  root: PowerlinesUserConfig["root"];

  /**
   * The directory where the application route files are located.
   *
   * @defaultValue "routes"
   */
  routesPath?: string;

  /**
   * The directory where static assets are located.
   *
   * @defaultValue "public"
   */
  publicPath?: string;

  /**
   * The base URL for the application.
   *
   * @defaultValue "http://localhost:3000"
   */
  baseUrl?: string;

  /**
   * Either disable the robots.txt generation or specify a custom path for the generated file.
   *
   * @defaultValue "\{publicPath\}/robots.txt"
   */
  robots?: false | string;
}
