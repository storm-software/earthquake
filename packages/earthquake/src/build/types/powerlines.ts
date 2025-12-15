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
  ReactPluginContext,
  ReactPluginResolvedConfig,
  ReactPluginUserConfig
} from "@powerlines/plugin-react/types/plugin";
import type { VitePluginContext } from "@powerlines/plugin-vite/types/plugin";
import type { StormURL } from "@stryke/url";
import type { ViteUserConfig } from "powerlines/types/config";
import type { UNSAFE_PluginContext } from "powerlines/types/internal";
import type { ViteResolvedConfig } from "powerlines/types/resolved";
import type { EarthquakeBuildContext } from "./context";
import type { EarthquakeOptions } from "./options";

export type EarthquakePluginUserConfig = ReactPluginUserConfig &
  ViteUserConfig & {
    earthquake?: Omit<EarthquakeOptions, "routesPath"> &
      Required<Pick<EarthquakeOptions, "routesPath">>;
  };

export type EarthquakePluginResolvedConfig = ReactPluginResolvedConfig &
  ViteResolvedConfig & {
    earthquake: Omit<
      EarthquakeOptions,
      "routesPath" | "publicPath" | "baseUrl"
    > &
      Required<Pick<EarthquakeOptions, "routesPath" | "publicPath">> & {
        baseUrl: StormURL;
      };
  };

export type EarthquakePluginContext<
  TResolvedConfig extends
    EarthquakePluginResolvedConfig = EarthquakePluginResolvedConfig
> = ReactPluginContext<TResolvedConfig> &
  VitePluginContext<TResolvedConfig> &
  UNSAFE_PluginContext & {
    earthquake: EarthquakeBuildContext;
  };
