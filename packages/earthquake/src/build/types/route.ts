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

export type ParamValue = string | Array<string> | undefined;
export type Params = Record<string, ParamValue>;

export enum DynamicParamTypes {
  SINGLE = "single",
  CATCH_ALL = "catch-all",
  OPTIONAL_CATCH_ALL = "optional-catch-all"
}

export interface RouteConfig {
  dynamicParamType: DynamicParamTypes;
  generateStaticParams?: GenerateStaticParams;
}

export type GenerateStaticParams =
  | Array<Record<string, string>>
  | (() => Promise<Array<Record<string, string>>>);

export interface RouteBuildData {
  paramName: string;
  paramType: DynamicParamTypes;
  config: RouteConfig;
  generateStaticParams?: GenerateStaticParams;
}

/**
 * Describes the different fallback modes that a given page can have.
 */
export enum FallbackMode {
  /**
   * A BLOCKING_STATIC_RENDER fallback will block the request until the page is
   * generated. No fallback page will be rendered, and users will have to wait
   * to render the page.
   */
  BLOCKING_STATIC_RENDER = "BLOCKING_STATIC_RENDER",

  /**
   * When set to PRERENDER, a fallback page will be sent to users in place of
   * forcing them to wait for the page to be generated. This allows the user to
   * see a rendered page earlier.
   */
  PRERENDER = "PRERENDER",

  /**
   * When set to NOT_FOUND, pages that are not already pre-rendered will result
   * in a not found response.
   */
  NOT_FOUND = "NOT_FOUND"
}
