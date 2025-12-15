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

import {
  extractInterceptRouteInformation,
  isInterceptRouteAppPath
} from "./intercept-route";

// Identify /.*[param].*/ in route string
const TEST_ROUTE = /\/[^/[]*\[[^/][^/\]]*\][^/]*(?=\/|$)/;

// Identify /[param]/ in route string
const TEST_STRICT_ROUTE = /\/\[[^/]+\](?=\/|$)/;

/**
 * Check if a route is dynamic.
 *
 * @param route - The route to check.
 * @param strict - Whether to use strict mode which prohibits segments with prefixes/suffixes (default: true).
 * @returns Whether the route is dynamic.
 */
export function isDynamicRoute(route: string, strict: boolean = true): boolean {
  if (isInterceptRouteAppPath(route)) {
    route = extractInterceptRouteInformation(route).interceptedRoute;
  }

  if (strict) {
    return TEST_STRICT_ROUTE.test(route);
  }

  return TEST_ROUTE.test(route);
}
