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
  Unstable_PluginContext,
  Unstable_PluginContextInternal
} from "@powerlines/core/types/_internal";
import type { CallHookOptions, EnvironmentContext } from "powerlines";
import type {
  EarthquakeBuildContext,
  InferHookParameters,
  InferHookReturnType
} from "./build";
import type { ResolvedConfig } from "./config";

export type Unstable_EarthquakeBuildContextInternal<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> = Unstable_PluginContextInternal<TResolvedConfig> & {
  /**
   * Call a hook within the Powerlines system
   *
   * @internal
   *
   * @param hook - The name of the hook to call
   * @param options - Options for calling the hook
   * @param args - Arguments to pass to the hook
   * @returns The result of the hook call
   */
  callHook: <TKey extends string>(
    hook: TKey,
    options: CallHookOptions & {
      environment?: string | EnvironmentContext<TResolvedConfig>;
    },
    ...args: InferHookParameters<EarthquakeBuildContext<TResolvedConfig>, TKey>
  ) => Promise<
    | InferHookReturnType<EarthquakeBuildContext<TResolvedConfig>, TKey>
    | undefined
  >;
};

export type Unstable_EarthquakeBuildContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> = Unstable_PluginContext<TResolvedConfig> &
  EarthquakeBuildContext<TResolvedConfig> & {
    $$internal: Unstable_EarthquakeBuildContextInternal<TResolvedConfig>;
  };
