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

import type { ParsedUrlQuery } from "node:querystring";
import type { COMPILER_NAMES } from "../constants";
import type { DomainLocale } from "../i18n/types/config";

export interface HtmlData {
  props: Record<string, any>;
  page: string;
  query: ParsedUrlQuery;
  buildId: string;
  assetPrefix?: string;
  nextExport?: boolean;
  autoExport?: boolean;
  isFallback?: boolean;
  isExperimentalCompile?: boolean;
  dynamicIds?: (string | number)[];
  err?: Error & {
    statusCode?: number;
    source?: typeof COMPILER_NAMES.server | typeof COMPILER_NAMES.edgeServer;
  };
  gsp?: boolean;
  gssp?: boolean;
  customServer?: boolean;
  gip?: boolean;
  appGip?: boolean;
  locale?: string;
  locales?: readonly string[];
  defaultLocale?: string;
  domainLocales?: readonly DomainLocale[];
  scriptLoader?: any[];
  isPreview?: boolean;
  notFoundSrcPage?: string;
}
