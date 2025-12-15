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

import React from "react";

export type ServerInsertedHtmlHook = (callbacks: () => React.ReactNode) => void;

/**
 * Creates a context for registering server-inserted HTML callbacks.
 *
 * @remarks
 * This context is intended to be used in server components to insert elements such as `<style>`, `<script>`, or `<link>` tags into the HTML document during server-side rendering. Use `React.createContext` to avoid errors from the RSC checks because it can't be imported directly in Server Components.
 *
 * @see https://github.com/vercel/next.js/pull/40686
 */
export const ServerInsertedHtmlContext: React.Context<ServerInsertedHtmlHook | null> =
  React.createContext<ServerInsertedHtmlHook | null>(null as any);
