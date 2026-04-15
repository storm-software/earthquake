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

import type { IsUndefined } from "@stryke/types/base";
import { replacePathTokens as replacePathTokensBase } from "powerlines/plugin-utils";
import type { EarthquakeBuildContext } from "../../types/build";

/**
 * Replaces tokens in the given path string with their corresponding values from the context.
 *
 * @remarks
 * The following tokens are supported:
 * - `{root}` - The root directory of the project.
 * - `{projectRoot}` - The root directory of the project (alias of `root`).
 * - `{workspaceRoot}` - The root directory of the workspace.
 * - `{powerlinesPath}` - The directory where Powerlines is installed.
 * - `{cachePath}` - The environment's directory for cached files.
 * - `{dataPath}` - The environment's directory for data files.
 * - `{logPath}` - The environment's directory for log files.
 * - `{tempPath}` - The environment's directory for temporary files.
 * - `{configPath}` - The environment's directory for configuration files.
 * - `{artifactsPath}` - The configured directory for build artifacts.
 * - `{builtinPath}` - The configured directory for built-in plugins.
 * - `{entryPath}` - The configured directory for entry files.
 * - `{routesPath}` - The configured directory for route files.
 * - `{assetsPath}` - The configured directory for asset files.
 * - `{publicPath}` - The configured directory for public files.
 *
 * @param context - The context containing the values for the path tokens.
 * @param path - The path string with tokens to replace.
 * @returns The path string with tokens replaced by their corresponding values from the context.
 */
export function replacePathTokens(
  context: EarthquakeBuildContext,
  path?: string
): IsUndefined<typeof path> extends true ? undefined : string {
  return (
    replacePathTokensBase(context, path)
      // .replaceAll("{routesPath}", context.config.input)
      .replaceAll("{publicPath}", context.config.earthquake.publicPath)
  );
}
