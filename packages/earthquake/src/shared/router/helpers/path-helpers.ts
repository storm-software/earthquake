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

import type { FlightRouterState, Route } from "../types/path";

export const PAGE_ROUTE_KEY = "__PAGE__";
export const DEFAULT_ROUTE_KEY = "__DEFAULT__";

export function getRouteValue(route: Route): string {
  return Array.isArray(route) ? route[1] : route;
}

export function isGroupRoute(route: string): boolean {
  // Use array[0] for performant purpose
  return route[0] === "(" && route.endsWith(")");
}

export function isParallelRoute(route: string): boolean {
  return route.startsWith("@") && route !== "@children";
}

export function addSearchParamsIfPageRoute(
  route: Route,
  searchParams: Record<string, string | string[] | undefined>
): Route {
  const isPageRoute = route.includes(PAGE_ROUTE_KEY);

  if (isPageRoute) {
    const stringifiedQuery = JSON.stringify(searchParams);

    return stringifiedQuery !== "{}"
      ? `${PAGE_ROUTE_KEY}?${stringifiedQuery}`
      : PAGE_ROUTE_KEY;
  }

  return route;
}

/**
 * Computes the selected layout route for a given parallel route key.
 *
 * @param routes - The array of routes for the parallel route key.
 * @param parallelRouteKey - The parallel route key to compute the selected layout route for.
 * @returns The selected layout route as a string, or null if no route is selected.
 */
export function computeSelectedLayoutRoute(
  routes: string[] | null,
  parallelRouteKey: string
): string | null {
  if (!routes || routes.length === 0) {
    return null;
  }

  // For 'children', use first route; for other parallel routes, use last route
  const route = (
    parallelRouteKey === "children" ? routes[0] : routes[routes.length - 1]
  )!;

  // If the default slot is showing, return null since it's not technically "selected" (it's a fallback)
  // Returning an internal value like `__DEFAULT__` would be confusing
  return route === DEFAULT_ROUTE_KEY ? null : route;
}

/**
 * Get the canonical parameters from the current level to the leaf node.
 *
 * @remarks
 * This function recursively traverses the FlightRouterState tree to find the selected layout route path for a given parallel route key. It assumes that the {@link tree} parameter is the subtree at the current level, and traverses down to the leaf node to collect all the parameters along the way.
 *
 * @param tree - The FlightRouterState tree to traverse.
 * @param parallelRouteKey - The key of the parallel route to find.
 * @param first - Whether this is the first call in the recursion.
 * @param routePath - The accumulated route path during recursion.
 * @returns The selected layout route path as an array of strings.
 */
export function getSelectedLayoutRoutePath(
  tree: FlightRouterState,
  parallelRouteKey: string,
  first = true,
  routePath: string[] = []
): string[] {
  let node: FlightRouterState;
  if (first) {
    // Use the provided parallel route key on the first parallel route
    node = tree[1][parallelRouteKey]!;
  } else {
    // After first parallel route prefer children, if there's no children pick the first parallel route.
    const parallelRoutes = tree[1];
    node = parallelRoutes.children ?? Object.values(parallelRoutes)[0]!;
  }

  if (!node) {
    return routePath;
  }

  const routeValue = getRouteValue(node[0]);
  if (!routeValue || routeValue.startsWith(PAGE_ROUTE_KEY)) {
    return routePath;
  }

  routePath.push(routeValue);
  return getSelectedLayoutRoutePath(node, parallelRouteKey, false, routePath);
}

/**
 * Normalizes an route so it represents the actual request path.
 *
 * @remarks
 * This function performs the following example transformations:
 * - `/(dashboard)/user/[id]/page` to `/user/[id]`
 * - `/(dashboard)/account/page` to `/account`
 * - `/user/[id]/page` to `/user/[id]`
 * - `/account/page` to `/account`
 * - `/page` to `/`
 * - `/(dashboard)/user/[id]/route` to `/user/[id]`
 * - `/(dashboard)/account/route` to `/account`
 * - `/user/[id]/route` to `/user/[id]`
 * - `/account/route` to `/account`
 * - `/route` to `/`
 * - `/` to `/`
 *
 * @param route - the app route to normalize
 * @returns the normalized pathname
 */
export function normalizePath(route: string): string {
  let normalizedPath = route
    .split("/")
    .reduce((pathname, route, index, routes) => {
      // Empty routes are ignored.
      if (!route) {
        return pathname;
      }

      // Groups are ignored.
      if (isGroupRoute(route)) {
        return pathname;
      }

      // Parallel routes are ignored.
      if (route[0] === "@") {
        return pathname;
      }

      // The last route (if it's a leaf) should be ignored.
      if (
        (route === "page" || route === "route") &&
        index === routes.length - 1
      ) {
        return pathname;
      }

      return `${pathname}/${route}`;
    }, "");
  if (!normalizedPath.startsWith("/")) {
    normalizedPath = `/${normalizedPath}`;
  }

  return normalizedPath;
}

/**
 * Strips the `.rsc` extension if it's in the pathname. Since this function is used on full urls it checks `?` for searchParams handling.
 *
 * @param url - the url to normalize
 * @returns the normalized url without the `.rsc` extension
 */
export function normalizeRscURL(url: string): string {
  return url.replace(
    /\.rsc($|\?)/,
    // $1 ensures `?` is preserved
    "$1"
  );
}
