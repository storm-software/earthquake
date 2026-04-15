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

import tsdown from "@powerlines/plugin-tsdown";
import { defineConfig } from "powerlines/config";

// interface CopyAddonOptions {
//   isCI: boolean;
//   desireWasmFiles: boolean;
// }

// Refer to `@earthquake/browser` package.
// In `@earthquake/browser`, there will be two builds:
// - ESM for Node (used in StackBlitz / WebContainers)
// - ESM for browser bundlers (used in Vite and running in the browser)
// type TargetBrowserPkg = "browser-pkg";

// // Refer to `earthquake` package
// type TargetRolldownPkg = "earthquake-pkg";

// type TargetRolldownPkgWasi = "earthquake-pkg-wasi";

// const target: TargetBrowserPkg | TargetRolldownPkg | TargetRolldownPkgWasi =
//   (function determineTarget() {
//     switch (process.env.TARGET) {
//       case undefined:
//       case "earthquake":
//         return "earthquake-pkg";
//       case "browser":
//         return "browser-pkg";
//       case "earthquake-wasi":
//         return "earthquake-pkg-wasi";
//       default:
//         console.warn(
//           `Unknown target: ${process.env.TARGET}, defaulting to 'earthquake-pkg'`
//         );
//         return "earthquake-pkg";
//     }
//   })();

// const bindingFile = path.resolve("src/binding.cjs");
// const bindingFileWasi = path.resolve("src/earthquake-binding.wasi.cjs");
// const bindingFileWasiBrowser = path.resolve(
//   "src/earthquake-binding.wasi-browser.js"
// );

// const WASM_FILE_LIST = [
//   "earthquake-binding.wasm32-wasi.wasm",
//   "earthquake-binding.wasi-browser.js",
//   "earthquake-binding.wasi.cjs",
//   "wasi-worker-browser.mjs",
//   "wasi-worker.mjs"
// ];

// const copyAddon = (
//   options: CopyAddonOptions = {
//     isCI: Boolean(process.env.CI),
//     desireWasmFiles: false
//   }
// ): Plugin => {
//   const addonsToEmit = new Map<string, string>();
//   const outputDir = "";
//   if (options.desireWasmFiles) {
//     const srcDir = join(fileURLToPath(import.meta.url), "..", "src");
//     for (const file of WASM_FILE_LIST) {
//       addonsToEmit.set(join(srcDir, file), "");
//     }
//   }

//   return {
//     name: "copy-addon",
//     resolveId: {
//       filter: {
//         id: /binding/
//       },
//       async handler(id, importer) {
//         if (id.endsWith(".node")) {
//           if (options.desireWasmFiles) {
//             return {
//               id,
//               external: true
//             };
//           }
//           if (importer) {
//             const addonPath = join(dirname(importer), id);
//             if (
//               await this.fs
//                 .stat(addonPath)
//                 .then(s => s.isFile())
//                 .catch(() => false)
//             ) {
//               addonsToEmit.set(addonPath, importer);
//               return {
//                 id: addonPath,
//                 external: true
//               };
//             }
//           }
//         }
//       }
//     },
//     async buildEnd() {
//       if (!options.isCI && addonsToEmit.size === 0) {
//         throw new Error("No .node files found");
//       }
//       if (options.isCI) {
//         return;
//       }
//       for (const addonPath of addonsToEmit.keys()) {
//         await this.fs.copyFile(addonPath, join(outputDir, basename(addonPath)));
//       }
//     }
//   };
// };

// // alias binding file to earthquake-binding.wasi.js and mark it as external
// // alias its dts file to earthquake-binding.d.ts without external
// const resolveWasiBinding = (): Plugin => {
//   return {
//     name: "resolve-wasi-binding",
//     resolveId: {
//       filter: { id: /\bbinding\b/ },
//       async handler(id, importer, options) {
//         const resolution = await this.resolve(id, importer, options);

//         if (resolution?.id === path.resolve("src/binding.cjs")) {
//           return {
//             id: path.resolve("src/earthquake-binding.wasi.cjs"),
//             external: "relative"
//           };
//         }

//         return resolution;
//       }
//     }
//   };
// };

// function patchBindingJs(): Plugin {
//   return {
//     name: "patch-binding-js",
//     transform: {
//       filter: {
//         id: "src/binding.cjs"
//       },
//       handler(code) {
//         return (
//           code
//             // inject binding auto download fallback for webcontainer
//             .replace(
//               "\nif (!nativeBinding) {",
//               s =>
//                 `
// if (!nativeBinding && globalThis.process?.versions?.["webcontainer"]) {
//   try {
//     nativeBinding = require('./webcontainer-fallback.cjs');
//   } catch (err) {
//     loadErrors.push(err)
//   }
// }
// ${s}`
//             )
//         );
//       }
//     }
//   };
// }

const config = defineConfig({
  skipCache: true,
  input: [
    "./src/index.ts",
    "./src/build/index.ts",
    "./src/config.ts",
    "./src/build/api.ts",
    "./src/build/plugin.ts",
    "./src/powerlines.ts",
    "./src/vite.ts"
  ],
  plugins: [tsdown()],
  resolve: {
    external: ["@earthquake/binding-*", "earthquake-binding.*"],
    skipNodeModulesBundle: true
  }
});

export default config;
