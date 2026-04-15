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
  BuildInlineConfig,
  CleanInlineConfig,
  DocsInlineConfig,
  LintInlineConfig,
  PluginConfig,
  PowerlinesAPI,
  PrepareInlineConfig
} from "powerlines";
import { createPowerlines } from "powerlines";
import type { UserConfig } from "../types/config";
import { plugin } from "./plugin";

/**
 * The Shell Shock API class.
 *
 * @remarks
 * This class provides methods to interact with the Earthquake build system, including cleaning, preparing, linting, building, generating documentation, and finalizing projects.
 */
export class EarthquakeAPI {
  #powerlines: PowerlinesAPI;

  public static async from(config: UserConfig): Promise<EarthquakeAPI> {
    const powerlines = await createPowerlines({
      framework: "earthquake",
      ...config,
      plugins: [
        plugin(config),
        ...(config.plugins ?? [])
      ] as PluginConfig<any>[]
    });

    return new EarthquakeAPI(powerlines);
  }

  private constructor(powerlines: PowerlinesAPI) {
    this.#powerlines = powerlines;
  }

  public async clean(inlineConfig: CleanInlineConfig): Promise<void> {
    return this.#powerlines.clean(inlineConfig);
  }

  public async prepare(inlineConfig: PrepareInlineConfig): Promise<void> {
    return this.#powerlines.prepare(inlineConfig);
  }

  public async lint(inlineConfig: LintInlineConfig): Promise<void> {
    return this.#powerlines.lint(inlineConfig);
  }

  public async build(inlineConfig: BuildInlineConfig): Promise<void> {
    return this.#powerlines.build(inlineConfig);
  }

  public async docs(inlineConfig: DocsInlineConfig): Promise<void> {
    return this.#powerlines.docs(inlineConfig);
  }

  public async finalize(): Promise<void> {
    return this.#powerlines.finalize();
  }
}

/**
 * Creates a new {@link EarthquakeAPI} instance.
 *
 * @param options - The user configuration options.
 * @returns A promise that resolves to a {@link EarthquakeAPI} instance.
 */
export async function createEarthquake(
  options: Partial<UserConfig> = {}
): Promise<EarthquakeAPI> {
  return EarthquakeAPI.from({ root: process.cwd(), ...options });
}
