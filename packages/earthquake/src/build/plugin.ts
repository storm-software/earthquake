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

import react from "@powerlines/plugin-react";
import vite from "@powerlines/plugin-vite";
import { joinPaths } from "@stryke/path/join-paths";
import { isString } from "@stryke/type-checks/is-string";
import { StormURL } from "@stryke/url/storm-url";
import type { Plugin, PluginContext } from "powerlines";
import type { EarthquakeBuildContext } from "../types/build";
import type { Options } from "../types/config";
import type { MaybePromise } from "./binding.cjs";

declare module "powerlines" {
  interface Config {
    earthquake?: Options;
  }

  interface BasePlugin<TContext extends PluginContext> {
    earthquake?: {
      /**
       * Hook to transform the code of a `layout` module. This can be used to implement features like file-based layouts, where the plugin automatically wraps page modules with a layout module.
       *
       * @param id - The ID of the module being transformed. This is typically the file path of the module.
       * @param code - The original code of the module.
       * @returns The transformed code, or a promise that resolves to the transformed code.
       */
      layout?: (this: TContext, id: string, code: string) => MaybePromise<void>;

      /**
       * Hook to transform the code of a `page` module.
       *
       * @param id - The ID of the module being transformed. This is typically the file path of the module.
       * @param code - The original code of the module.
       * @returns The transformed code, or a promise that resolves to the transformed code.
       */
      page?: (this: TContext, id: string, code: string) => MaybePromise<void>;
    };
  }
}

/**
 * The core Powerlines plugin to build Earthquake projects.
 */
export const plugin = <
  TContext extends EarthquakeBuildContext = EarthquakeBuildContext
>(
  options: Options
) => {
  return [
    vite({
      ...options,
      publicDir: options.publicPath || joinPaths("{projectRoot}", "public")
    }),
    react(options.react),
    {
      name: "earthquake",
      config() {
        this.debug(
          "Providing default configuration for the Earthquake build plugin."
        );

        return {
          framework: "earthquake",
          output: {
            format: ["esm"]
          },
          environments: {
            // `rsc` environment loads modules with `react-server` condition.
            // this environment is responsible for:
            // - RSC stream serialization (React VDOM -> RSC stream)
            // - server functions handling
            rsc: {
              build: {
                rollupOptions: {
                  input: {
                    index: "./src/runtime/entry.rsc.tsx"
                  }
                }
              }
            },

            // `ssr` environment loads modules without `react-server` condition.
            // this environment is responsible for:
            // - RSC stream deserialization (RSC stream -> React VDOM)
            // - traditional SSR (React VDOM -> HTML string/stream)
            ssr: {
              build: {
                rollupOptions: {
                  input: {
                    index: "./src/runtime/entry.ssr.tsx"
                  }
                }
              }
            },

            // client environment is used for hydration and client-side rendering
            // this environment is responsible for:
            // - RSC stream deserialization (RSC stream -> React VDOM)
            // - traditional CSR (React VDOM -> Browser DOM tree mount/hydration)
            // - refetch and re-render RSC
            // - calling server functions
            client: {
              build: {
                rollupOptions: {
                  input: {
                    index: "./src/runtime/entry.browser.tsx"
                  }
                }
              }
            }
          },
          earthquake: {
            publicPath: joinPaths("{projectRoot}", "public"),
            baseUrl: options.baseUrl
          }
        };
      },
      // configEnvironment(environment: EnvironmentResolvedConfig) {
      //   return {
      //     resolve: {
      //       dedupe: [
      //         "react",
      //         "react-dom",
      //         "@tanstack/react-start",
      //         "@tanstack/react-router"
      //       ]
      //     },
      //     optimizeDeps:
      //       environment.consumer === "client" ||
      //       (environment.consumer === "server" &&
      //         // This indicates that the server environment has opted in to dependency optimization
      //         this.config.build.optimizeDeps?.noDiscovery === false)
      //         ? {
      //             // As `@tanstack/react-start` depends on `@tanstack/react-router`, we should exclude both.
      //             exclude: [
      //               "@tanstack/react-start",
      //               "@tanstack/react-router",
      //               "@tanstack/react-router-devtools",
      //               "@tanstack/start-static-server-functions"
      //             ],
      //             include: [
      //               "react",
      //               "react/jsx-runtime",
      //               "react/jsx-dev-runtime",
      //               "react-dom",
      //               ...(environment.consumer === "client"
      //                 ? ["react-dom/client"]
      //                 : ["react-dom/server"]),
      //               // `@tanstack/react-store` has a dependency on `use-sync-external-store`, which is CJS.
      //               // It therefore needs to be included so that it is converted to ESM.
      //               "@tanstack/react-router > @tanstack/react-store",
      //               ...(this.config.build.optimizeDeps?.exclude?.find(
      //                 x => x === "@tanstack/react-form"
      //               )
      //                 ? ["@tanstack/react-form > @tanstack/react-store"]
      //                 : [])
      //             ]
      //           }
      //         : undefined
      //   };
      // },
      configResolved() {
        this.trace("Earthquake plugin configuration has been resolved.");

        if (
          !this.config.earthquake.baseUrl &&
          this.config.mode === "production"
        ) {
          throw new Error(
            "The `earthquake.baseUrl` configuration option is required when running in `production` mode."
          );
        }

        if (
          !this.config.earthquake.baseUrl ||
          isString(this.config.earthquake.baseUrl)
        ) {
          this.config.earthquake.baseUrl = new StormURL(
            this.config.earthquake.baseUrl || "http://localhost:3000"
          );
        }
      }
    }
  ] as Plugin<TContext>[];
};
