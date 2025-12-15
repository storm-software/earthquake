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

export function resolveArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value as any;
  }
  return [value] as any;
}

export function resolveAsArrayOrUndefined<T>(
  value: T | T[] | undefined | null
): T extends undefined | null ? undefined : T[] {
  if (typeof value === "undefined" || value === null) {
    return undefined as any;
  }
  return resolveArray(value) as any;
}

export function getOrigin(url: string | URL): string | undefined {
  let origin;
  if (typeof url === "string") {
    try {
      url = new URL(url);
      origin = url.origin;
    } catch {
      // Do nothing
    }
  }
  return origin;
}
