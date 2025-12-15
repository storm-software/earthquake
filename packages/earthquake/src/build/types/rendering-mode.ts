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

/**
 * The rendering mode for a route.
 */
export enum RenderingMode {
  /**
   * `STATIC` rendering mode will output a fully static HTML page or error if anything dynamic is used.
   */
  STATIC = "STATIC",

  /**
   * `PARTIALLY_STATIC` rendering mode will output a fully static HTML page if the route is fully static, but will output a partially static HTML page if the route uses uses any dynamic API's.
   */
  PARTIALLY_STATIC = "PARTIALLY_STATIC"
}
