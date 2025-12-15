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

"use client";

import type React from "react";
import { useContext } from "react";
import { ServerInsertedHtmlContext } from "../contexts";

/**
 * Registers a callback to insert Html into the server-rendered Html stream.
 *
 * @remarks
 * This hook is intended to be used in server components to insert elements such as `<style>`, `<script>`, or `<link>` tags into the Html document during server-side rendering.
 *
 * @param callback - A function that returns the React nodes to be inserted into the Html stream.
 */
export function useServerInsertedHtml(callback: () => React.ReactNode): void {
  const addInsertedServerHtmlCallback = useContext(ServerInsertedHtmlContext);
  // Should have no effects on client where there's no flush effects provider
  if (addInsertedServerHtmlCallback) {
    addInsertedServerHtmlCallback(callback);
  }
}
