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

export const BUILD_ASSETS_MANIFEST_NAME = "__earthquake_assets_manifest.js";

export interface ClientReferenceMeta {
  importId: string;
  // same as `importId` during dev. hashed id during build.
  referenceKey: string;
  packageSource?: string;
  // build only for tree-shaking unused export
  exportNames: string[];
  renderedExports: string[];
  serverChunk?: string;
  groupChunkId?: string;
}

export interface ServerReferenceMeta {
  importId: string;
  referenceKey: string;
  exportNames: string[];
}

export class RuntimeAsset {
  runtime: string;

  constructor(value: string) {
    this.runtime = value;
  }
}

export interface AssetsManifest {
  bootstrapScriptContent: string | RuntimeAsset;
  clientReferenceDeps: Record<string, AssetDeps>;
  serverResources?: Record<string, Pick<AssetDeps, "css">>;
}

export interface AssetDeps {
  js: (string | RuntimeAsset)[];
  css: (string | RuntimeAsset)[];
}

export interface ResolvedAssetsManifest {
  bootstrapScriptContent: string;
  clientReferenceDeps: Record<string, ResolvedAssetDeps>;
  serverResources?: Record<string, Pick<ResolvedAssetDeps, "css">>;
}

export interface ResolvedAssetDeps {
  js: string[];
  css: string[];
}
