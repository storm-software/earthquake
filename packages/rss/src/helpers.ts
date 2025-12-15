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

import type { RSSOptions } from "./types";

/**
 * Normalize URL to its canonical form
 *
 * @param url - URL string
 * @param trailingSlash - Whether to include a trailing slash
 * @param base - Base URL to resolve relative URLs
 * @returns Canonical URL string
 */
export function createCanonicalURL(
  url: string,
  trailingSlash?: RSSOptions["trailingSlash"],
  base?: string
): string {
  let pathname = url.replace(/\/index.html$/, ""); // index.html is not canonical
  if (!getUrlExtension(url)) {
    // add trailing slash if there’s no extension or `trailingSlash` is true
    pathname = pathname.replace(/\/*$/, "/");
  }

  pathname = pathname.replace(/\/+/g, "/"); // remove duplicate slashes (URL() won’t)

  const canonicalUrl = new URL(pathname, base).href;
  if (trailingSlash === false) {
    // remove the trailing slash
    return canonicalUrl.replace(/\/*$/, "");
  }
  return canonicalUrl;
}

/** Check if a URL is already valid */
export function isValidURL(url: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch {
    // Do nothing
  }
  return false;
}

function getUrlExtension(url: string) {
  const lastDot = url.lastIndexOf(".");
  const lastSlash = url.lastIndexOf("/");

  return lastDot > lastSlash ? url.slice(lastDot + 1) : "";
}
