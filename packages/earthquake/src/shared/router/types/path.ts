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

export type DynamicParamTypes =
  | "catchall"
  | "catchall-intercepted-(..)(..)"
  | "catchall-intercepted-(.)"
  | "catchall-intercepted-(..)"
  | "catchall-intercepted-(...)"
  | "optional-catchall"
  | "dynamic"
  | "dynamic-intercepted-(..)(..)"
  | "dynamic-intercepted-(.)"
  | "dynamic-intercepted-(..)"
  | "dynamic-intercepted-(...)";

export type DynamicParamTypesShort =
  | "c"
  | "ci(..)(..)"
  | "ci(.)"
  | "ci(..)"
  | "ci(...)"
  | "oc"
  | "d"
  | "di(..)(..)"
  | "di(.)"
  | "di(..)"
  | "di(...)";

export type Route =
  | string
  | [
      // Param name
      paramName: string,
      // Param cache key (almost the same as the value, but arrays are
      // concatenated into strings)
      // TODO: We should change this to just be the value. Currently we convert
      // it back to a value when passing to useParams. It only needs to be
      // a string when converted to a a cache key, but that doesn't mean we
      // need to store it as that representation.
      paramCacheKey: string,
      // Dynamic param type
      dynamicParamType: DynamicParamTypesShort
    ];

/**
 * Router state
 */
export type FlightRouterState = [
  route: Route,
  parallelRoutes: { [parallelRouterKey: string]: FlightRouterState },
  url?: string | null,
  /**
   * "refresh" and "refetch", despite being similarly named, have different
   * semantics:
   * - "refetch" is used during a request to inform the server where rendering
   *   should start from.
   *
   * - "refresh" is used by the client to mark that a route should re-fetch the
   *   data from the server for the current route. It uses the "url" property
   *   above to determine where to fetch from.
   *
   * - "inside-shared-layout" is used during a prefetch request to inform the
   *   server that even if the route matches, it should be treated as if it's
   *   within the "new" part of a navigation — inside the shared layout. If
   *   the route doesn't match, then it has no effect, since it would be
   *   treated as new regardless. If it does match, though, the server does not
   *   need to render it, because the client already has it.
   *
   * - "metadata-only" instructs the server to skip rendering the routes and
   *   only send the head data.
   *
   *   A bit confusing, but that's because it has only one extremely narrow use
   *   case — during a non-PPR prefetch, the server uses it to find the first
   *   loading boundary beneath a shared layout.
   *
   *   TODO: We should rethink the protocol for dynamic requests. It might not
   *   make sense for the client to send a FlightRouterState, since this type is
   *   overloaded with concerns.
   */
  refresh?:
    | "refetch"
    | "refresh"
    | "inside-shared-layout"
    | "metadata-only"
    | null,
  isRootLayout?: boolean,
  /**
   * Only present when responding to a tree prefetch request. Indicates whether
   * there is a loading boundary somewhere in the tree. The client cache uses
   * this to determine if it can skip the data prefetch request.
   */
  hasLoadingBoundary?: HasLoadingBoundary
];

export enum HasLoadingBoundary {
  // There is a loading boundary in this particular route
  ROUTE_HAS_LOADING_BOUNDARY = 1,
  // There is a loading boundary somewhere in the subtree (but not in
  // this route)
  SUBTREE_HAS_LOADING_BOUNDARY = 2,
  // There is no loading boundary in this route or any of its descendants
  SUBTREE_HAS_NO_LOADING_BOUNDARY = 3
}

/**
 * Individual Flight response path
 */
export type FlightRoutePath =
  // Uses `any` as repeating pattern can't be typed.
  | any[]
  // Looks somewhat like this
  | [
      route: Route,
      parallelRouterKey: string,
      route: Route,
      parallelRouterKey: string,
      route: Route,
      parallelRouterKey: string
    ];

export type LoadingModuleData =
  | [React.JSX.Element, React.ReactNode, React.ReactNode]
  | null;

/** viewport metadata node */
export type HeadData = React.ReactNode;

/**
 * Represents a tree of segments and the Flight data (i.e. React nodes) that
 * correspond to each one. The tree is isomorphic to the FlightRouterState;
 * however in the future we want to be able to fetch arbitrary partial segments
 * without having to fetch all its children. So this response format will
 * likely change.
 */
export type CacheNodeSeedData = [
  node: React.ReactNode | null,
  parallelRoutes: {
    [parallelRouterKey: string]: CacheNodeSeedData | null;
  },
  loading: LoadingModuleData | Promise<LoadingModuleData>,
  isPartial: boolean,
  /** TODO: this doesn't feel like it belongs here, because it's only used during build, in `collectRouteData` */
  hasRuntimePrefetch: boolean
];

export type FlightDataRoute = [
  /* segment of the rendered slice: */ Route,
  /* treePatch */ FlightRouterState,
  /* cacheNodeSeedData */ CacheNodeSeedData | null, // Can be null during prefetch if there's no loading component
  /* head: viewport */ HeadData,
  /* isHeadPartial */ boolean
];

export type FlightDataPath =
  // Uses `any` as repeating pattern can't be typed.
  | any[]
  // Looks somewhat like this
  | [
      // Holds full path to the segment.
      ...FlightRoutePath[],
      ...FlightDataRoute
    ];

/**
 * The Flight response data
 */
export type FlightData = Array<FlightDataPath> | string;

export type ActionResult = Promise<any>;

export interface InitialRSCPayload {
  /** buildId */
  b: string;
  /** initialCanonicalUrlParts */
  c: string[];
  /** initialRenderedSearch */
  q: string;
  /** couldBeIntercepted */
  i: boolean;
  /** initialFlightData */
  f: FlightDataPath[];
  /** missingSlots */
  m: Set<string> | undefined;
  /** GlobalError */
  G: [React.ComponentType<any>, React.ReactNode | undefined];
  /** prerendered */
  S: boolean;
}

// Response from `createFromFetch` for normal rendering
export interface NavigationFlightResponse {
  /** buildId */
  b: string;
  /** flightData */
  f: FlightData;
  /** prerendered */
  S: boolean;
  /** runtimePrefetch - [isPartial, staleTime]. Only present in runtime prefetch responses. */
  rp?: [boolean, number];
}

// Response from `createFromFetch` for server actions. Action's flight data can be null
export interface ActionFlightResponse {
  /** actionResult */
  a: ActionResult;
  /** buildId */
  b: string;
  /** flightData */
  f: FlightData;
}

export type RSCPayload =
  | InitialRSCPayload
  | NavigationFlightResponse
  | ActionFlightResponse;
