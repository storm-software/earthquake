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

import type { ReactPluginContext } from "@powerlines/plugin-react";
import type { VitePluginContext } from "@powerlines/plugin-vite";
import type { MaybePromise } from "@stryke/types/base";
import type {
  Context,
  HookFunctions,
  Plugin,
  PluginHook,
  PluginHooks,
  TransformResult,
  UnpluginBuilderVariant,
  UnpluginHookFunctions,
  UnpluginOptions
} from "powerlines";
import type {
  BindingPluginLayoutParams,
  BindingPluginPageParams
} from "../build/binding.cjs";
import type { ResolvedConfig } from "./config";

export type EarthquakeBuildContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> = Context<TResolvedConfig> &
  VitePluginContext<TResolvedConfig> &
  ReactPluginContext<TResolvedConfig>;

export const EARTHQUAKE_BUILD_HOOKS = [
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

export interface EarthquakeBuildHookFunctions<
  TContext extends EarthquakeBuildContext = EarthquakeBuildContext
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
    ctx: BindingPluginLayoutParams
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
    ctx: BindingPluginPageParams
  ) => MaybePromise<TransformResult>;
}

export type EarthquakePluginHookFunctions<
  TContext extends EarthquakeBuildContext = EarthquakeBuildContext
> = HookFunctions<TContext> & EarthquakeBuildHookFunctions<TContext>;

export type EarthquakePluginHooks<
  TContext extends EarthquakeBuildContext = EarthquakeBuildContext
> = {
  [TPluginHook in keyof EarthquakePluginHookFunctions<TContext>]?: PluginHook<
    EarthquakePluginHookFunctions<TContext>[TPluginHook]
  >;
} & {
  /**
   * A hook that is called to overwrite the generated declaration types file (.d.ts). The generated type definitions should describe the built-in modules/logic added during the `prepare` task.
   *
   * @param this - The build context.
   * @param code - The source code to generate types for.
   * @returns A promise that resolves when the hook is complete.
   */
  layout: PluginHook<
    (
      this: TContext,
      ctx: BindingPluginLayoutParams
    ) => MaybePromise<TransformResult>,
    "id" | "code"
  >;

  /**
   * A hook that is called to overwrite the generated declaration types file (.d.ts). The generated type definitions should describe the built-in modules/logic added during the `prepare` task.
   *
   * @param this - The build context.
   * @param code - The source code to generate types for.
   * @returns A promise that resolves when the hook is complete.
   */
  page: PluginHook<
    (
      this: TContext,
      ctx: BindingPluginPageParams
    ) => MaybePromise<TransformResult>,
    "id" | "code"
  >;
} & PluginHooks<TContext>;

export type EarthquakePluginHookKeys<
  TContext extends EarthquakeBuildContext = EarthquakeBuildContext
> = keyof EarthquakePluginHooks<TContext>;

export type EarthquakePlugin<
  TContext extends EarthquakeBuildContext = EarthquakeBuildContext
> = Plugin<TContext> & EarthquakePluginHooks<TContext>;

export type InferHookFunction<
  TContext extends EarthquakeBuildContext,
  TKey extends string
> = TKey extends `${infer TUnpluginBuilderVariant}:${infer TUnpluginField}`
  ? TUnpluginBuilderVariant extends UnpluginBuilderVariant
    ? TUnpluginField extends keyof Required<UnpluginOptions>[TUnpluginBuilderVariant]
      ? UnpluginHookFunctions<TContext, TUnpluginBuilderVariant, TUnpluginField>
      : never
    : never
  : TKey extends keyof EarthquakeBuildHookFunctions<TContext>
    ? EarthquakeBuildHookFunctions<TContext>[TKey]
    : never;

export type InferHookReturnType<
  TContext extends EarthquakeBuildContext,
  TKey extends string
> = ReturnType<InferHookFunction<TContext, TKey>>;

export type InferHookParameters<
  TContext extends EarthquakeBuildContext,
  TKey extends string
> = Parameters<InferHookFunction<TContext, TKey>>;

export type InferHookThisType<
  TContext extends EarthquakeBuildContext,
  TKey extends string
> = ThisParameterType<InferHookFunction<TContext, TKey>>;
