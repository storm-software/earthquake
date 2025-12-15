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

import "./virtual";

declare global {
  interface ImportMeta {
    readonly earthquake: {
      loadCss: (importer?: string) => import("react").ReactNode;
      loadModule: <T>(environmentName: string, entryName: string) => Promise<T>;
      loadBootstrapScriptContent: (entryName: string) => Promise<string>;

      /** @deprecated use `loadModule("ssr", entry)` instead */
      loadSsrModule: <T>(entry: string) => Promise<T>;
    };
  }

  interface ImportMetaEnv {
    readonly __earthquake_rsc__: boolean;
  }
}

// We implement the behavior of `import 'server-only'` and `import 'client-only'` on the compiler level
// and thus don't require having them installed as dependencies.
// By default it works fine with typescript, because (surprisingly) TSC *doesn't check side-effecting imports*.
// But this behavior can be overridden with `noUncheckedSideEffectImports`
// (https://www.typescriptlang.org/tsconfig/#noUncheckedSideEffectImports)
// which'd cause `import 'server-only'` to start erroring.
// To prevent that, we add declarations for them here.

declare module "server-only" {
  /**
   * `import 'server-only'` marks your module as only usable on the server
   * and prevents it from being used on the client.
   * Read more: https://docs.stormsoftware.com/projects/earthquake/getting-started/server-and-client-components#preventing-environment-poisoning
   */
}

declare module "client-only" {
  /**
   * `import 'client-only'` marks your module as only usable on the client
   * and prevents it from being used on the server.
   * Read more: https://docs.stormsoftware.com/projects/earthquake/getting-started/server-and-client-components#preventing-environment-poisoning
   */
}

interface Window {
  MSInputMethodContext?: unknown;
  /** @internal */
  __EARTHQUAKE_HMR_CB?: null | ((message?: string) => void);
  /** @internal */
  __earthquake_root_layout_missing_tags?: ("html" | "body")[];
  /** @internal */
  __EARTHQUAKE_DEV_INDICATOR_POSITION?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
}

interface EarthquakeFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

interface RequestInit {
  earthquake?: EarthquakeFetchRequestConfig | undefined;
}

declare module "vite" {
  interface UserConfig {
    /** Options for `earthquake` */
    earthquake?: import("earthquake").RscPluginOptions;
  }
}

export {};
