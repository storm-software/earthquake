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

import { isDynamicRoute } from "./is-dynamic";

// Translate a pages asset path (relative from a common prefix) back into its logical route

// "asset path" being its javascript file, data file, prerendered html,...

export function getRouteFromAssetPath(
  assetPath: string,
  ext: string = ""
): string {
  assetPath = assetPath.replace(/\\/g, "/");
  assetPath =
    ext && assetPath.endsWith(ext)
      ? assetPath.slice(0, -ext.length)
      : assetPath;
  if (assetPath.startsWith("/index/") && !isDynamicRoute(assetPath)) {
    assetPath = assetPath.slice(6);
  } else if (assetPath === "/index") {
    assetPath = "/";
  }
  return assetPath;
}
