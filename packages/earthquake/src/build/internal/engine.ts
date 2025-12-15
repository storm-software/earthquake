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

import type { SelectHooksOptions } from "powerlines/types/context";
import type { HookKeys } from "powerlines/types/hooks";
import type {
  BindingError,
  BindingPluginLayoutData,
  BindingPluginPageData
} from "../binding.cjs";
import {
  BindingEngine,
  shutdownAsyncRuntime,
  startAsyncRuntime
} from "../binding.cjs";
import type { RoutesOutput } from "../types/engine";
import type { EarthquakePluginHookKeys } from "../types/plugin";
import type { EarthquakePluginContext } from "../types/powerlines";

// @ts-expect-error TS2540: the polyfill of `asyncDispose`.
Symbol.asyncDispose ??= Symbol("Symbol.asyncDispose");

export class EarthquakeEngine {
  #context: EarthquakePluginContext;

  #isClosed = false;

  #engine: BindingEngine;

  #stopWorkers?: () => Promise<void>;

  static asyncRuntimeShutdown = false;

  public constructor(context: EarthquakePluginContext) {
    this.#context = context;

    const callHook = async (
      hook: EarthquakePluginHookKeys,
      order: SelectHooksOptions["order"],
      ...args: any[]
    ) => {
      return context.$$internal.callHook(
        hook as HookKeys<EarthquakePluginContext>,
        {
          order
        },
        args
      );
    };

    this.#engine = new BindingEngine({
      name: context.config.name,
      description: context.config.description,
      version: context.packageJson.version,
      baseUrl: context.config.earthquake.baseUrl.toEncoded(),
      checksum: context.meta.checksum,
      buildId: context.meta.buildId,
      releaseId: context.meta.releaseId,
      timestamp: BigInt(context.meta.timestamp),
      projectRootHash: context.meta.projectRootHash,
      configHash: context.meta.configHash,
      external: context.config.build.external,
      noExternal: context.config.build.noExternal,
      skipNodeModulesBundle: context.config.build.skipNodeModulesBundle,
      platform: context.config.build.platform,
      logLevel: context.config.logLevel || "silent",
      customLogger: context.config.customLogger,
      pluginApi: {
        layoutPre: async (path: string, opts: BindingPluginLayoutData) => {
          await callHook("layout", "pre", path, opts);
        },
        layout: async (path: string, opts: BindingPluginLayoutData) => {
          await callHook("layout", "normal", path, opts);
        },
        layoutPost: async (path: string, opts: BindingPluginLayoutData) => {
          await callHook("layout", "post", path, opts);
        },
        pagePre: async (path: string, opts: BindingPluginPageData) => {
          await callHook("page", "pre", path, opts);
        },
        page: async (path: string, opts: BindingPluginPageData) => {
          await callHook("page", "normal", path, opts);
        },
        pagePost: async (path: string, opts: BindingPluginPageData) => {
          await callHook("page", "post", path, opts);
        }
      },
      projectRoot: context.config.projectRoot,
      workspaceRoot: context.workspaceConfig.workspaceRoot,
      routesPath: context.config.earthquake.routesPath,
      publicPath: context.config.earthquake.publicPath,
      artifactsPath: context.artifactsPath,
      builtinPath: context.builtinsPath,
      entryPath: context.entryPath,
      cachePath: context.cachePath,
      dataPath: context.dataPath,
      logPath: context.envPaths.log,
      tempPath: context.envPaths.temp,
      configPath: context.envPaths.config,
      outputPath: context.config.output.outputPath,
      tsconfig: context.tsconfig.tsconfigFilePath
    });
  }

  get isClosed(): boolean {
    return this.#isClosed;
  }

  async prepareRoutes(): Promise<RoutesOutput> {
    await this.#stopWorkers?.();
    if (EarthquakeEngine.asyncRuntimeShutdown) {
      startAsyncRuntime();
    }

    const result: Awaited<ReturnType<BindingEngine["prepareRoutes"]>> =
      await this.#engine.prepareRoutes();
    if (
      (result as { errors: BindingError[]; isBindingErrors: boolean })
        ?.isBindingErrors
    ) {
      throw new Error(
        `Earthquake - Prepare processing failed with errors: ${(
          result as { errors: BindingError[] }
        ).errors
          .map(e => e.field0.message)
          .join("\n")}`
      );
    }

    this.#context.trace("Earthquake - Prepare processing completed.");
    return result as any;
  }

  /**
   * Close the build and free resources.
   */
  async close(): Promise<void> {
    await this.#stopWorkers?.();
    await this.#engine.close();
    shutdownAsyncRuntime();
    EarthquakeEngine.asyncRuntimeShutdown = true;
    this.#stopWorkers = void 0;
  }

  async [Symbol.asyncDispose](): Promise<void> {
    await this.close();
  }
}
