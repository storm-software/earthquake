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

// import type { DeepReadonly } from "@stryke/types/utilities";
import type { Context, JSX } from "react";
import { createContext, useContext } from "react";
// import type { BuildManifest } from "../../server/get-page-files";
// import type { ServerRuntime } from "../../types";
import type { HtmlData } from "../types/html";

export interface HtmlProps {
  __earthquake_data__: HtmlData;
  nonce?: string;
  dangerousAsPath: string;
  docComponentsRendered: {
    Html?: boolean;
    Main?: boolean;
    Head?: boolean;
    Script?: boolean;
  };
  // buildManifest: BuildManifest;
  isDevelopment: boolean;
  dynamicImports: string[];
  /**
   * This manifest is only needed for Pages dir, Production, Webpack
   * @see https://github.com/vercel/next.js/pull/72959
   */
  dynamicCssManifest: Set<string>;
  assetPrefix?: string;
  headTags: any[];
  unstable_runtimeJS?: false;
  unstable_JsPreload?: false;
  assetQueryString: string;
  scriptLoader: {
    afterInteractive?: string[];
    beforeInteractive?: any[];
    worker?: any[];
  };
  locale?: string;
  disableOptimizedLoading?: boolean;
  styles?: React.ReactElement[] | Iterable<React.ReactNode>;
  head?: Array<JSX.Element | null>;
  crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;
  optimizeCss?: any;
  earthquakeScriptWorkers?: boolean;
  // runtime?: ServerRuntime;
  hasConcurrentFeatures?: boolean;
  largePageDataBytes?: number;
  // fontManifest?: DeepReadonly<FontManifest>;
  experimentalClientTraceMetadata?: string[];
}

export const HtmlContext: Context<HtmlProps | undefined> = createContext<
  HtmlProps | undefined
>(undefined);

export function useHtmlContext(): HtmlProps {
  const context = useContext(HtmlContext);

  if (!context) {
    throw new Error(
      `<Html> should not be imported outside of pages/_document.\n` +
        "Read more: https://nextjs.org/docs/messages/no-document-import-in-page"
    );
  }

  return context;
}
