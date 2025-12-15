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

import type { DynamicParamTypes, FallbackMode, Params } from "./route";

interface StaticPrerenderedRoute {
  readonly params: Params;
  readonly pathname: string;
  readonly encodedPathname: string;
  readonly fallbackRouteParams: undefined;
  readonly fallbackMode: FallbackMode | undefined;
  readonly fallbackRootParams: undefined;

  /**
   * When enabled, the route will be rendered with diagnostics enabled which
   * will error the build if the route that is generated is empty.
   */
  throwOnEmptyStaticShell: undefined;
}

export interface FallbackRouteParam {
  /**
   * The name of the param.
   */
  readonly paramName: string;

  /**
   * The type of the param.
   */
  readonly paramType: DynamicParamTypes;
}

interface FallbackPrerenderedRoute {
  readonly params: Params;
  readonly pathname: string;
  readonly encodedPathname: string;

  /**
   * The fallback route params for the route. This includes all route parameters
   * that are unknown at build time, from both the main children route and any
   * parallel routes.
   */
  readonly fallbackRouteParams: readonly FallbackRouteParam[];
  readonly fallbackMode: FallbackMode | undefined;
  readonly fallbackRootParams: readonly string[];

  /**
   * When enabled, the route will be rendered with diagnostics enabled which
   * will error the build if the route that is generated is empty.
   */
  throwOnEmptyStaticShell: boolean;
}

export type PrerenderedRoute =
  | StaticPrerenderedRoute
  | FallbackPrerenderedRoute;

export interface StaticPathsResult {
  fallbackMode: FallbackMode | undefined;
  prerenderedRoutes: PrerenderedRoute[] | undefined;
}
