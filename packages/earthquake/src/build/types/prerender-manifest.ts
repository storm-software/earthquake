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

// import type { RenderingMode } from "./rendering-mode";

// type Fallback = null | boolean | string;

// export interface PrerenderManifestRoute {
//   dataRoute: string | null;

//   experimentalBypassFor?: RouteHas[];

//   /**
//    * The headers that should be served along side this prerendered route.
//    */
//   initialHeaders?: Record<string, string>;

//   /**
//    * The status code that should be served along side this prerendered route.
//    */
//   initialStatus?: number;

//   /**
//    * The revalidate value for this route. This might be inferred from:
//    * - route segment configs
//    * - fetch calls
//    * - unstable_cache
//    * - "use cache"
//    */
//   initialRevalidateSeconds: Revalidate;

//   /**
//    * The expire value for this route, which is inferred from the "use cache"
//    * functions that are used by the route, or the expireTime config.
//    */
//   initialExpireSeconds: number | undefined;

//   /**
//    * The prefetch data route associated with this page. If not defined, this
//    * page does not support prefetching.
//    */
//   prefetchDataRoute: string | null | undefined;

//   /**
//    * The dynamic route that this statically pre-rendered route is based on. If
//    * this is null, then the route was not based on a dynamic route.
//    */
//   srcRoute: string | null;

//   /**
//    * The rendering mode for this route. Only `undefined` when not an app router
//    * route.
//    */
//   renderingMode: RenderingMode | undefined;

//   /**
//    * The headers that are allowed to be used when revalidating this route. These
//    * are used internally by Next.js to revalidate routes.
//    */
//   allowHeader: string[];
// }

// export interface DynamicPrerenderManifestRoute {
//   dataRoute: string | null;
//   dataRouteRegex: string | null;
//   experimentalBypassFor?: RouteHas[];
//   fallback: Fallback;

//   /**
//    * When defined, it describes the revalidation configuration for the fallback
//    * route.
//    */
//   fallbackRevalidate: Revalidate | undefined;

//   /**
//    * When defined, it describes the expire configuration for the fallback route.
//    */
//   fallbackExpire: number | undefined;

//   /**
//    * The headers that should used when serving the fallback.
//    */
//   fallbackHeaders?: Record<string, string>;

//   /**
//    * The status code that should be used when serving the fallback.
//    */
//   fallbackStatus?: number;

//   /**
//    * The root params that are unknown for this fallback route.
//    */
//   fallbackRootParams: readonly string[] | undefined;

//   /**
//    * The fallback route params for this route that were parsed from the loader
//    * tree.
//    */
//   fallbackRouteParams: readonly FallbackRouteParam[] | undefined;

//   /**
//    * The source route that this fallback route is based on. This is a reference
//    * so that we can associate this dynamic route with the correct source.
//    */
//   fallbackSourceRoute: string | undefined;

//   prefetchDataRoute: string | null | undefined;
//   prefetchDataRouteRegex: string | null | undefined;
//   routeRegex: string;

//   /**
//    * The rendering mode for this route. Only `undefined` when not an app router
//    * route.
//    */
//   renderingMode: RenderingMode | undefined;

//   /**
//    * The headers that are allowed to be used when revalidating this route. These
//    * are used internally by Next.js to revalidate routes.
//    */
//   allowHeader: string[];
// }

// /**
//  * The headers that are allowed to be used when revalidating routes. Currently
//  * this includes both headers used by the pages and app routers.
//  */
// const ALLOWED_HEADERS: string[] = [
//   "host",
//   MATCHED_PATH_HEADER,
//   PRERENDER_REVALIDATE_HEADER,
//   PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER,
//   NEXT_CACHE_REVALIDATED_TAGS_HEADER,
//   NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER
// ];

// export interface PrerenderManifest {
//   version: 4;
//   routes: { [route: string]: PrerenderManifestRoute };
//   dynamicRoutes: { [route: string]: DynamicPrerenderManifestRoute };
//   notFoundRoutes: string[];
//   preview: __ApiPreviewProps;
// }

// interface ManifestBuiltRoute {
//   /**
//    * The route pattern used to match requests for this route.
//    */
//   regex: string;
// }

// export type ManifestRewriteRoute = ManifestBuiltRoute & Rewrite;
// export type ManifestRedirectRoute = ManifestBuiltRoute & Redirect;
// export type ManifestHeaderRoute = ManifestBuiltRoute & Header;

// export type ManifestRoute = ManifestBuiltRoute & {
//   page: string;
//   namedRegex: string;
//   routeKeys: { [key: string]: string };

//   /**
//    * If true, this indicates that the route has fallback root params. This is
//    * used to simplify the route regex for matching.
//    */
//   hasFallbackRootParams?: boolean;

//   /**
//    * The prefetch segment data routes for this route. This is used to rewrite
//    * the prefetch segment data routes (or the inverse) to the correct
//    * destination.
//    */
//   prefetchSegmentDataRoutes?: PrefetchSegmentDataRoute[];

//   /**
//    * If true, this indicates that the route should not be considered for routing
//    * for the internal router, and instead has been added to support external
//    * routers.
//    */
//   skipInternalRouting?: boolean;
// };

// interface ManifestDataRoute {
//   page: string;
//   routeKeys?: { [key: string]: string };
//   dataRouteRegex: string;
//   namedDataRouteRegex?: string;
// }

// export interface RoutesManifest {
//   version: number;
//   pages404: boolean;
//   appType: "app" | "pages" | "hybrid";
//   basePath: string;
//   redirects: Array<ManifestRedirectRoute>;
//   rewrites: {
//     beforeFiles: Array<ManifestRewriteRoute>;
//     afterFiles: Array<ManifestRewriteRoute>;
//     fallback: Array<ManifestRewriteRoute>;
//   };
//   headers: Array<ManifestHeaderRoute>;
//   staticRoutes: Array<ManifestRoute>;
//   dynamicRoutes: ReadonlyArray<DynamicManifestRoute>;
//   dataRoutes: Array<ManifestDataRoute>;
//   i18n?: {
//     domains?: ReadonlyArray<{
//       http?: true;
//       domain: string;
//       locales?: readonly string[];
//       defaultLocale: string;
//     }>;
//     locales: readonly string[];
//     defaultLocale: string;
//     localeDetection?: false;
//   };
//   rsc: {
//     header: typeof RSC_HEADER;
//     didPostponeHeader: typeof NEXT_DID_POSTPONE_HEADER;
//     contentTypeHeader: typeof RSC_CONTENT_TYPE_HEADER;
//     varyHeader: string;
//     prefetchHeader: typeof NEXT_ROUTER_PREFETCH_HEADER;
//     suffix: typeof RSC_SUFFIX;
//     prefetchSegmentHeader: typeof NEXT_ROUTER_SEGMENT_PREFETCH_HEADER;
//     prefetchSegmentDirSuffix: typeof RSC_SEGMENTS_DIR_SUFFIX;
//     prefetchSegmentSuffix: typeof RSC_SEGMENT_SUFFIX;

//     /**
//      * Whether the client param parsing is enabled. This is automatically enabled when
//      * cacheComponents is enabled.
//      */
//     clientParamParsing: boolean;

//     /**
//      * The origins that are allowed to write the rewritten headers when
//      * performing a non-relative rewrite. When undefined, no non-relative
//      * rewrites will get the rewrite headers.
//      */
//     clientParamParsingOrigins: string[] | undefined;
//     dynamicRSCPrerender: boolean;
//   };
//   rewriteHeaders: {
//     pathHeader: typeof NEXT_REWRITTEN_PATH_HEADER;
//     queryHeader: typeof NEXT_REWRITTEN_QUERY_HEADER;
//   };
//   skipProxyUrlNormalize?: boolean;
//   caseSensitive?: boolean;
//   /**
//    * Configuration related to Partial Prerendering.
//    */
//   ppr?: {
//     /**
//      * The chained response for the PPR resume.
//      */
//     chain: {
//       /**
//        * The headers that will indicate to Next.js that the request is for a PPR
//        * resume.
//        */
//       headers: Record<string, string>;
//     };
//   };
// }
