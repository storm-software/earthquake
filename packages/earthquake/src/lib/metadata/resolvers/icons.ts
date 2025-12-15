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

import { IconKeys } from "../constants";
import { resolveAsArrayOrUndefined } from "../helpers";
import type { Icon, IconDescriptor, ResolvedMetadata } from "../types/metadata";
import type { FieldResolver } from "../types/resolvers";
import { isStringOrURL } from "./url";

export function resolveIcon(icon: Icon): IconDescriptor {
  if (isStringOrURL(icon)) {
    return { url: icon };
  }

  return icon;
}

export const resolveIcons: FieldResolver<"icons"> = icons => {
  if (!icons) {
    return null;
  }

  const resolved: ResolvedMetadata["icons"] = {
    icon: [],
    apple: []
  };
  if (Array.isArray(icons)) {
    resolved.icon = icons.map(resolveIcon).filter(Boolean);
  } else if (isStringOrURL(icons)) {
    resolved.icon = [resolveIcon(icons)];
  } else {
    for (const key of IconKeys) {
      const values = resolveAsArrayOrUndefined(icons[key]);
      if (values) resolved[key] = values.map(resolveIcon);
    }
  }
  return resolved;
};
