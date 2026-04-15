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

import { getRouteFromAssetPath } from "../../shared/router/helpers/get-route-from-asset-path";

/**
 * Match a bundle path against a regex and return the corresponding route.
 *
 * @param regex - The regular expression to match against.
 * @param input - The input string to match.
 * @returns The route corresponding to the matched bundle path, or null if no match is found.
 */
export default function matchBundle(
  regex: RegExp,
  input: string
): string | null {
  const result = regex.exec(input);

  if (!result) {
    return null;
  }

  return getRouteFromAssetPath(`/${result[1]}`);
}

// /**
//  * Get the route from an entrypoint file path.
//  *
//  * @param context - The Earthquake plugin context.
//  * @param entryFile - The entrypoint file path.
//  * @returns The route corresponding to the entrypoint file path, or null if no route matches.
//  */
// export function getRouteFromEntrypoint(
//   context: EarthquakeBuildContext,
//   entryFile: string
// ): string | null {
//   const path = matchBundle(
//     new RegExp(`^${context.config.earthquake.routesPath}[/\\](.*)$`),
//     entryFile
//   );
//   if (isString(path) && !path) {
//     return "/";
//   }

//   if (path) {
//     return path;
//   }

//   // Potentially the passed item is a browser bundle so we try to match that also
//   return matchBundle(/^static[/\\]pages[/\\](.*)$/, entryFile);
// }
