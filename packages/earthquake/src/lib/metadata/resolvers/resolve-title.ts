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

import type { AbsoluteTemplateString, Metadata } from "../types/metadata";

function resolveTitleTemplate(
  template: string | null | undefined,
  title: string
) {
  return template ? template.replace(/%s/g, title) : title;
}

export function resolveTitle(
  title: Metadata["title"],
  stashedTemplate: string | null | undefined
): AbsoluteTemplateString {
  let resolved;
  const template =
    typeof title !== "string" && title && "template" in title
      ? title.template
      : null;

  if (typeof title === "string") {
    resolved = resolveTitleTemplate(stashedTemplate, title);
  } else if (title) {
    if ("default" in title) {
      resolved = resolveTitleTemplate(stashedTemplate, title.default);
    }
    if ("absolute" in title && title.absolute) {
      resolved = title.absolute;
    }
  }

  if (title && typeof title !== "string") {
    return {
      template,
      absolute: resolved || ""
    };
  } else {
    return { absolute: resolved || title || "", template };
  }
}
