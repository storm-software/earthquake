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

import type { JSX } from "react";
import { BootstrapScriptDescriptor } from "react-dom/server";

declare module "react-dom/server" {
  /**
   * Options for `resume`.
   *
   * https://github.com/facebook/react/blob/aec521a96d3f1bebc2ba38553d14f4989c6e88e0/packages/react-dom/src/server/ReactDOMFizzServerEdge.js#L54-L60
   */
  export interface ResumeOptions {
    nonce?: string;
    signal?: AbortSignal;
    onError?: (error: unknown) => string | undefined | void;
    onPostpone?: (reason: string) => void;
    unstable_externalRuntimeSrc?: string | BootstrapScriptDescriptor;
  }

  export function resume(
    children: JSX.Element,
    postponedState: object,
    options?: ResumeOptions
  ): Promise<ReadableStream<Uint8Array>>;

  /**
   * Options for `renderToReadableStream`.
   *
   * https://github.com/facebook/react/blob/aec521a96d3f1bebc2ba38553d14f4989c6e88e0/packages/react-dom/src/server/ReactDOMFizzServerEdge.js#L36-L52
   */
  export interface RenderToReadableStreamOptions {
    onPostpone?: (reason: string) => void;
    unstable_externalRuntimeSrc?: string | BootstrapScriptDescriptor;
    importMap?: {
      imports?: {
        [specifier: string]: string;
      };
      scopes?: {
        [scope: string]: {
          [specifier: string]: string;
        };
      };
    };
    formState?: unknown;
    onHeaders?: (headers: Headers) => void;
    maxHeadersLength?: number;
  }
}

declare module "react-dom/static" {
  /**
   * Options for `prerender`.
   *
   * https://github.com/facebook/react/blob/aec521a96d3f1bebc2ba38553d14f4989c6e88e0/packages/react-dom/src/server/ReactDOMFizzStaticEdge.js#L35-L49
   */
  export interface PrerenderOptions {
    onPostpone?: (reason: string) => void;
    unstable_externalRuntimeSrc?: string | BootstrapScriptDescriptor;
    importMap?: {
      imports?: {
        [specifier: string]: string;
      };
      scopes?: {
        [scope: string]: {
          [specifier: string]: string;
        };
      };
    };
    onHeaders?: (headers: Headers) => void;
    maxHeadersLength?: number;
  }

  interface PrerenderResult {
    postponed: object | null;
  }
}
