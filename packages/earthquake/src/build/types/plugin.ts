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

import type { MaybePromise } from "@stryke/types/base";
import type { TransformResult } from "powerlines/types/context";
import type {
  ExternalPluginHookFunctions,
  Plugin,
  PluginHook
} from "powerlines/types/plugin";
import type { EarthquakePluginContext } from "./powerlines";

export const EARTHQUAKE_PLUGIN_HOOKS = [
  "route",
  "layout",
  "page",
  "default",
  "error",
  "loading",
  "template",
  "notFound",
  "forbidden",
  "unauthorized",
  "middleware",
  "globalError",
  "globalNotFound"
] as const;

export interface EarthquakeBasePluginHookFunctions<
  TContext extends EarthquakePluginContext = EarthquakePluginContext
> {
  /**
   * A hook that is called to overwrite the generated declaration types file (.d.ts). The generated type definitions should describe the built-in modules/logic added during the `prepare` task.
   *
   * @param this - The build context.
   * @param code - The source code to generate types for.
   * @returns A promise that resolves when the hook is complete.
   */
  layout: (
    this: TContext,
    code: string,
    id: string
  ) => MaybePromise<TransformResult>;

  /**
   * A hook that is called to overwrite the generated declaration types file (.d.ts). The generated type definitions should describe the built-in modules/logic added during the `prepare` task.
   *
   * @param this - The build context.
   * @param code - The source code to generate types for.
   * @returns A promise that resolves when the hook is complete.
   */
  page: (
    this: TContext,
    code: string,
    id: string
  ) => MaybePromise<TransformResult>;
}

export type EarthquakePluginHookFunctions<
  TContext extends EarthquakePluginContext = EarthquakePluginContext
> = EarthquakeBasePluginHookFunctions<TContext> &
  ExternalPluginHookFunctions<TContext>;

export interface EarthquakePluginHooks<
  TContext extends EarthquakePluginContext = EarthquakePluginContext
> {
  /**
   * A hook that is called to overwrite the generated declaration types file (.d.ts). The generated type definitions should describe the built-in modules/logic added during the `prepare` task.
   *
   * @param this - The build context.
   * @param code - The source code to generate types for.
   * @returns A promise that resolves when the hook is complete.
   */
  layout: PluginHook<
    (this: TContext, code: string, id: string) => MaybePromise<TransformResult>,
    "code" | "id"
  >;

  /**
   * A hook that is called to overwrite the generated declaration types file (.d.ts). The generated type definitions should describe the built-in modules/logic added during the `prepare` task.
   *
   * @param this - The build context.
   * @param code - The source code to generate types for.
   * @returns A promise that resolves when the hook is complete.
   */
  page: PluginHook<
    (this: TContext, code: string, id: string) => MaybePromise<TransformResult>,
    "code" | "id"
  >;
}

export type EarthquakePluginHookKeys<
  TContext extends EarthquakePluginContext = EarthquakePluginContext
> = keyof EarthquakePluginHooks<TContext>;

export type EarthquakePlugin<
  TContext extends EarthquakePluginContext = EarthquakePluginContext
> = Plugin<TContext> & EarthquakePluginHooks<TContext>;
