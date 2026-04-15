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

import type { Unstable_EarthquakeBuildContext } from "../../types/_internal";
import type { EarthquakeBuildContext } from "../../types/build";
import type {
  BindingError,
  BindingPluginLayoutParams,
  BindingPluginPageParams
} from "../binding.cjs";
import {
  BindingStaticAnalysisEngine,
  shutdownAsyncRuntime,
  startAsyncRuntime
} from "../binding.cjs";
import type { RoutesOutput } from "../types/engine";

// @ts-expect-error TS2540: the polyfill of `asyncDispose`.
Symbol.asyncDispose ??= Symbol("Symbol.asyncDispose");

export class StaticAnalysisEngine {
  #context: Unstable_EarthquakeBuildContext;

  #isClosed = false;

  #binding: BindingStaticAnalysisEngine;

  #stopWorkers?: () => Promise<void>;

  static asyncRuntimeShutdown = false;

  public constructor(context: EarthquakeBuildContext) {
    this.#context = context as unknown as Unstable_EarthquakeBuildContext;

    this.#binding = new BindingStaticAnalysisEngine({
      name: context.config.name,
      title: context.config.title,
      description: context.config.description,
      baseUrl: context.config.earthquake.baseUrl.toEncoded(),
      external: context.config.resolve.external,
      noExternal: context.config.resolve.noExternal,
      skipNodeModulesBundle: context.config.resolve.skipNodeModulesBundle,
      logLevel: context.config.logLevel || "silent",
      customLogger: context.config.customLogger,
      pluginApi: {
        layoutPre: async (params: BindingPluginLayoutParams) => {
          await this.#context.$$internal.callHook(
            "earthquake:layout",
            { order: "pre" },
            params.path,
            params.code
          );
        },
        layout: async (params: BindingPluginLayoutParams) => {
          await this.#context.$$internal.callHook(
            "earthquake:layout",
            { order: "normal" },
            params.path,
            params.code
          );
        },
        layoutPost: async (params: BindingPluginLayoutParams) => {
          await this.#context.$$internal.callHook(
            "earthquake:layout",
            { order: "post" },
            params.path,
            params.code
          );
        },
        pagePre: async (params: BindingPluginPageParams) => {
          await this.#context.$$internal.callHook(
            "earthquake:page",
            { order: "pre" },
            params.path,
            params.code
          );
        },
        page: async (params: BindingPluginPageParams) => {
          await this.#context.$$internal.callHook(
            "earthquake:page",
            { order: "normal" },
            params.path,
            params.code
          );
        },
        pagePost: async (params: BindingPluginPageParams) => {
          await this.#context.$$internal.callHook(
            "earthquake:page",
            { order: "post" },
            params.path,
            params.code
          );
        }
      },
      root: context.config.root,
      workspaceRoot: context.workspaceConfig.workspaceRoot,
      inputPath: context.config.input,
      publicPath: context.config.earthquake.publicPath,
      artifactsPath: context.artifactsPath,
      builtinPath: context.builtinsPath,
      entryPath: context.entryPath,
      cachePath: context.cachePath,
      dataPath: context.dataPath,
      logPath: context.envPaths.log,
      tempPath: context.envPaths.temp,
      configPath: context.envPaths.config,
      outputPath: context.config.output.path,
      tsconfig: context.tsconfig.tsconfigFilePath
    });
  }

  get isClosed(): boolean {
    return this.#isClosed;
  }

  async prepare(): Promise<RoutesOutput> {
    this.#context.debug("Earthquake - Static Analysis started.");

    await this.#stopWorkers?.();
    if (StaticAnalysisEngine.asyncRuntimeShutdown) {
      startAsyncRuntime();
    }

    const result: Awaited<ReturnType<BindingStaticAnalysisEngine["prepare"]>> =
      await this.#binding.prepare();
    if (
      (result as { errors: BindingError[]; isBindingErrors: boolean })
        ?.isBindingErrors
    ) {
      throw new Error(
        `Earthquake - Static Analysis failed with errors: ${(
          result as { errors: BindingError[] }
        ).errors
          .map(e => e.field0.message)
          .join("\n")}`
      );
    }

    this.#context.debug("Earthquake - Static Analysis completed.");

    return { path: this.#context.config.input, ...result };
  }

  /**
   * Close the build and free resources.
   */
  async close(): Promise<void> {
    await this.#stopWorkers?.();
    await this.#binding.close();

    shutdownAsyncRuntime();

    StaticAnalysisEngine.asyncRuntimeShutdown = true;
    this.#stopWorkers = undefined;
  }

  async [Symbol.asyncDispose](): Promise<void> {
    await this.close();
  }
}
