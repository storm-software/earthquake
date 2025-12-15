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

import React from "react";

export function Meta({
  name,
  property,
  content,
  media
}: {
  name?: string;
  property?: string;
  media?: string;
  content: string | number | URL | null | undefined;
}): React.ReactElement | null {
  if (typeof content !== "undefined" && content !== null && content !== "") {
    return (
      <meta
        {...(name ? { name } : { property })}
        {...(media ? { media } : undefined)}
        content={typeof content === "string" ? content : content.toString()}
      />
    );
  }
  return null;
}

export function MetaFilter<T extends object | object[]>(
  items: (T | null)[]
): NonNullable<T>[] {
  const acc: NonNullable<T>[] = [];
  for (const item of items) {
    if (Array.isArray(item)) {
      acc.push(
        ...item.filter(
          (i): i is NonNullable<T> => i !== null && i !== undefined
        )
      );
    } else if (item !== null && item !== undefined) {
      acc.push(item);
    }
  }
  return acc;
}

type ExtendMetaContent = Record<
  string,
  undefined | string | URL | number | boolean | null | undefined
>;
type MultiMetaContent =
  | (ExtendMetaContent | string | URL | number)[]
  | null
  | undefined;

function camelToSnake(camelCaseStr: string) {
  return camelCaseStr.replace(/[A-Z]/g, match => {
    return `_${match.toLowerCase()}`;
  });
}

const aliasPropPrefixes = new Set([
  "og:image",
  "twitter:image",
  "og:video",
  "og:audio"
]);

function getMetaKey(prefix: string, key: string) {
  // Use `twitter:image` and `og:image` instead of `twitter:image:url` and `og:image:url`
  // to be more compatible as it's a more common format.
  // `og:video` & `og:audio` do not have a `:url` suffix alias
  if (aliasPropPrefixes.has(prefix) && key === "url") {
    return prefix;
  }
  if (prefix.startsWith("og:") || prefix.startsWith("twitter:")) {
    key = camelToSnake(key);
  }
  return `${prefix}:${key}`;
}

function ExtendMeta({
  content,
  namePrefix,
  propertyPrefix
}: {
  content?: ExtendMetaContent;
  namePrefix?: string;
  propertyPrefix?: string;
}) {
  if (!content) return null;
  return MetaFilter(
    Object.entries(content).map(([k, v]) => {
      return typeof v === "undefined"
        ? null
        : Meta({
            ...(propertyPrefix && { property: getMetaKey(propertyPrefix, k) }),
            ...(namePrefix && { name: getMetaKey(namePrefix, k) }),
            content: typeof v === "string" ? v : v?.toString()
          });
    })
  );
}

export function MultiMeta({
  propertyPrefix,
  namePrefix,
  contents
}: {
  propertyPrefix?: string;
  namePrefix?: string;
  contents?: MultiMetaContent | null;
}) {
  if (typeof contents === "undefined" || contents === null) {
    return null;
  }

  return MetaFilter(
    contents.map(content => {
      if (
        typeof content === "string" ||
        typeof content === "number" ||
        content instanceof URL
      ) {
        return Meta({
          ...(propertyPrefix
            ? { property: propertyPrefix }
            : { name: namePrefix }),
          content
        });
      } else {
        return ExtendMeta({
          namePrefix,
          propertyPrefix,
          content
        });
      }
    })
  );
}
