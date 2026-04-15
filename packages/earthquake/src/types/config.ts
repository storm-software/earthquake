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

import type {
  ReactPluginOptions,
  ReactPluginResolvedConfig
} from "@powerlines/plugin-react";
import type {
  VitePluginOptions,
  VitePluginResolvedConfig
} from "@powerlines/plugin-vite";
import type { StormURL } from "@stryke/url/storm-url";
import type {
  OutputConfig as PowerlinesOutputConfig,
  ResolvedConfig as PowerlinesResolvedConfig,
  UserConfig as PowerlinesUserConfig
} from "powerlines";

export interface BaseOptions {
  /**
   * The directory where static assets are located.
   *
   * @defaultValue "\{root\}/public"
   */
  publicPath?: string;

  /**
   * The base URL for the application.
   *
   * @defaultValue "http://localhost:3000"
   */
  baseUrl?: string;

  /**
   * Either disable the robots.txt generation or specify a custom path for the generated file.
   *
   * @defaultValue "\{root\}/robots.txt"
   */
  robots?: false | string;
}

/**
 * The plugin options for Earthquake.
 */
export interface Options extends BaseOptions {
  /**
   * Options that are passed to the {@link https://www.npmjs.com/package/@powerlines/plugin-react | @powerlines/plugin-react} used in the build process.
   */
  react?: Pick<ReactPluginOptions, "compiler" | "reactRefreshHost">;

  /**
   * Options that are passed to the {@link https://www.npmjs.com/package/@powerlines/plugin-vite | @powerlines/plugin-vite} used in the build process.
   */
  vite?: VitePluginOptions;
}

/**
 * The output configuration options for Earthquake.
 */
export type OutputConfig = Pick<
  PowerlinesOutputConfig,
  "path" | "copy" | "storage" | "types" | "dts"
>;

/**
 * The user configuration options for Earthquake.
 */
export type UserConfig = Pick<
  PowerlinesUserConfig,
  | "root"
  | "name"
  | "title"
  | "description"
  | "logLevel"
  | "mode"
  | "skipCache"
  | "autoInstall"
  | "plugins"
  | "tsconfig"
  | "tsconfigRaw"
> &
  Options & {
    /**
     * The directory where the application route files are located.
     *
     * @defaultValue "\{root\}/app"
     */
    input?: string;

    /**
     * Configuration for the output of the build process
     */
    output?: OutputConfig;
  };

/**
 * The resolved configuration options for Earthquake.
 */
export type ResolvedConfig = PowerlinesResolvedConfig &
  VitePluginResolvedConfig &
  ReactPluginResolvedConfig & {
    /**
     * The resolved configuration for the Earthquake build process. This includes the user-provided options merged with any default values or values derived from the environment. This configuration is used during the build process to determine how to build the application, where to output files, and how to generate type definitions.
     */
    earthquake: Required<Omit<BaseOptions, "baseUrl">> & {
      /**
       * The base URL for the application. This is derived from the `baseUrl` option provided by the user, or defaults to "http://localhost:3000" if not provided.
       */
      baseUrl: StormURL;
    };

    /**
     * The directory where the application route files are located.
     *
     * @defaultValue "\{root\}/app"
     */
    input: string;

    /**
     * The user configuration for the Earthquake process.
     */
    userConfig: UserConfig;
  };
