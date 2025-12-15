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

import type { Metadata } from "../../lib/metadata/types/metadata";

export interface RoutesOutput {
  /**
   * The path of the route.
   */
  path: string;

  /**
   * The current content of the page module.
   */
  page?: string;

  /**
   * The current content of the layout module.
   */
  layout?: string;

  /**
   * The current content of the error module.
   */
  error?: string;

  /**
   * The current content of the global error module.
   */
  globalError?: string;

  /**
   * The current content of the global not found module.
   */
  globalNotFound?: string;

  /**
   * The current content of the loading module.
   */
  loading?: string;

  /**
   * The current content of the template module.
   */
  template?: string;

  /**
   * The current content of the forbidden module.
   */
  forbidden?: string;

  /**
   * The current content of the unauthorized module.
   */
  unauthorized?: string;

  /**
   * The current content of the not found module.
   */
  notFound?: string;

  /**
   * The current content of the default module.
   */
  default?: string;

  /**
   * The current content of the API route module.
   */
  api?: string;

  /**
   * The current content of the middleware module.
   */
  middleware?: string;

  /**
   * Metadata associated with the route.
   */
  metadata?: Metadata;
}
