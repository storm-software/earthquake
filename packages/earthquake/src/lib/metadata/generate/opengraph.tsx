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

import type { ResolvedMetadata } from "../types/metadata";
import type { TwitterAppDescriptor } from "../types/twitter";

import { Meta, MetaFilter, MultiMeta } from "./meta";

type MultiMetaProps = Parameters<typeof MultiMeta>[0];
type MultiMetaContents = MultiMetaProps extends { contents: infer C }
  ? C
  : never;

function normalizeMultiMetaContents(contents?: unknown[]): MultiMetaContents {
  if (!contents) {
    return contents as MultiMetaContents;
  }

  const normalized = contents.map(content => {
    if (typeof content === "string" || typeof content === "number") {
      return content;
    }

    if (content instanceof URL) {
      return content;
    }

    if (typeof content !== "object" || content === null) {
      return String(content);
    }

    return Object.entries(content).reduce<
      Record<string, string | number | boolean | null | undefined>
    >((acc, [key, value]) => {
      if (value === undefined) {
        return acc;
      }

      if (value instanceof URL) {
        acc[key] = value.toString();
      } else if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null
      ) {
        acc[key] = value;
      } else {
        acc[key] = String(value);
      }

      return acc;
    }, {});
  });

  return normalized as MultiMetaContents;
}

export function OpenGraphMetadata({
  openGraph
}: {
  openGraph: ResolvedMetadata["openGraph"];
}) {
  if (!openGraph) {
    return null;
  }

  let typedOpenGraph;
  if ("type" in openGraph) {
    const openGraphType = openGraph.type;
    switch (openGraphType) {
      case "website":
        typedOpenGraph = [Meta({ property: "og:type", content: "website" })];
        break;
      case "article":
        typedOpenGraph = [
          Meta({ property: "og:type", content: "article" }),
          Meta({
            property: "article:published_time",
            content: openGraph.publishedTime?.toString()
          }),
          Meta({
            property: "article:modified_time",
            content: openGraph.modifiedTime?.toString()
          }),
          Meta({
            property: "article:expiration_time",
            content: openGraph.expirationTime?.toString()
          }),
          MultiMeta({
            propertyPrefix: "article:author",
            contents: openGraph.authors
          }),
          Meta({ property: "article:section", content: openGraph.section }),
          MultiMeta({
            propertyPrefix: "article:tag",
            contents: openGraph.tags
          })
        ];
        break;
      case "book":
        typedOpenGraph = [
          Meta({ property: "og:type", content: "book" }),
          Meta({ property: "book:isbn", content: openGraph.isbn }),
          Meta({
            property: "book:release_date",
            content: openGraph.releaseDate
          }),
          MultiMeta({
            propertyPrefix: "book:author",
            contents: openGraph.authors
          }),
          MultiMeta({ propertyPrefix: "book:tag", contents: openGraph.tags })
        ];
        break;
      case "profile":
        typedOpenGraph = [
          Meta({ property: "og:type", content: "profile" }),
          Meta({
            property: "profile:first_name",
            content: openGraph.firstName
          }),
          Meta({ property: "profile:last_name", content: openGraph.lastName }),
          Meta({ property: "profile:username", content: openGraph.username }),
          Meta({ property: "profile:gender", content: openGraph.gender })
        ];
        break;
      case "music.song":
        typedOpenGraph = [
          Meta({ property: "og:type", content: "music.song" }),
          Meta({
            property: "music:duration",
            content: openGraph.duration?.toString()
          }),
          MultiMeta({
            propertyPrefix: "music:album",
            contents: normalizeMultiMetaContents(openGraph.albums)
          }),
          MultiMeta({
            propertyPrefix: "music:musician",
            contents: openGraph.musicians
          })
        ];
        break;
      case "music.album":
        typedOpenGraph = [
          Meta({ property: "og:type", content: "music.album" }),
          MultiMeta({
            propertyPrefix: "music:song",
            contents: normalizeMultiMetaContents(openGraph.songs)
          }),
          MultiMeta({
            propertyPrefix: "music:musician",
            contents: openGraph.musicians
          }),
          Meta({
            property: "music:release_date",
            content: openGraph.releaseDate
          })
        ];
        break;
      case "music.playlist":
        typedOpenGraph = [
          Meta({ property: "og:type", content: "music.playlist" }),
          MultiMeta({
            propertyPrefix: "music:song",
            contents: normalizeMultiMetaContents(openGraph.songs)
          }),
          MultiMeta({
            propertyPrefix: "music:creator",
            contents: openGraph.creators
          })
        ];
        break;
      case "music.radio_station":
        typedOpenGraph = [
          Meta({ property: "og:type", content: "music.radio_station" }),
          MultiMeta({
            propertyPrefix: "music:creator",
            contents: openGraph.creators
          })
        ];
        break;

      case "video.movie":
        typedOpenGraph = [
          Meta({ property: "og:type", content: "video.movie" }),
          MultiMeta({
            propertyPrefix: "video:actor",
            contents: normalizeMultiMetaContents(openGraph.actors)
          }),
          MultiMeta({
            propertyPrefix: "video:director",
            contents: openGraph.directors
          }),
          MultiMeta({
            propertyPrefix: "video:writer",
            contents: openGraph.writers
          }),
          Meta({ property: "video:duration", content: openGraph.duration }),
          Meta({
            property: "video:release_date",
            content: openGraph.releaseDate
          }),
          MultiMeta({ propertyPrefix: "video:tag", contents: openGraph.tags })
        ];
        break;
      case "video.episode":
        typedOpenGraph = [
          Meta({ property: "og:type", content: "video.episode" }),
          MultiMeta({
            propertyPrefix: "video:actor",
            contents: normalizeMultiMetaContents(openGraph.actors)
          }),
          MultiMeta({
            propertyPrefix: "video:director",
            contents: openGraph.directors
          }),
          MultiMeta({
            propertyPrefix: "video:writer",
            contents: openGraph.writers
          }),
          Meta({ property: "video:duration", content: openGraph.duration }),
          Meta({
            property: "video:release_date",
            content: openGraph.releaseDate
          }),
          MultiMeta({ propertyPrefix: "video:tag", contents: openGraph.tags }),
          Meta({ property: "video:series", content: openGraph.series })
        ];
        break;
      case "video.tv_show":
        typedOpenGraph = [
          Meta({ property: "og:type", content: "video.tv_show" })
        ];
        break;
      case "video.other":
        typedOpenGraph = [
          Meta({ property: "og:type", content: "video.other" })
        ];
        break;

      default:
        throw new Error(`Invalid OpenGraph type: ${String(openGraphType)}`);
    }
  }

  return MetaFilter([
    Meta({ property: "og:determiner", content: openGraph.determiner }),
    Meta({ property: "og:title", content: openGraph.title?.absolute }),
    Meta({ property: "og:description", content: openGraph.description }),
    Meta({ property: "og:url", content: openGraph.url?.toString() }),
    Meta({ property: "og:site_name", content: openGraph.siteName }),
    Meta({ property: "og:locale", content: openGraph.locale }),
    Meta({ property: "og:country_name", content: openGraph.countryName }),
    Meta({ property: "og:ttl", content: openGraph.ttl?.toString() }),
    MultiMeta({
      propertyPrefix: "og:image",
      contents: normalizeMultiMetaContents(openGraph.images)
    }),
    MultiMeta({
      propertyPrefix: "og:video",
      contents: normalizeMultiMetaContents(openGraph.videos)
    }),
    MultiMeta({
      propertyPrefix: "og:audio",
      contents: normalizeMultiMetaContents(openGraph.audio)
    }),
    MultiMeta({
      propertyPrefix: "og:email",
      contents: normalizeMultiMetaContents(openGraph.emails)
    }),
    MultiMeta({
      propertyPrefix: "og:phone_number",
      contents: normalizeMultiMetaContents(openGraph.phoneNumbers)
    }),
    MultiMeta({
      propertyPrefix: "og:fax_number",
      contents: normalizeMultiMetaContents(openGraph.faxNumbers)
    }),
    MultiMeta({
      propertyPrefix: "og:locale:alternate",
      contents: normalizeMultiMetaContents(openGraph.alternateLocale)
    }),
    ...(typedOpenGraph ?? [])
  ]);
}

function TwitterAppItem({
  app,
  type
}: {
  app: TwitterAppDescriptor;
  type: "iphone" | "ipad" | "googleplay";
}) {
  return [
    Meta({ name: `twitter:app:name:${type}`, content: app.name }),
    Meta({ name: `twitter:app:id:${type}`, content: app.id[type] }),
    Meta({
      name: `twitter:app:url:${type}`,
      content: app.url?.[type]?.toString()
    })
  ];
}

export function TwitterMetadata({
  twitter
}: {
  twitter: ResolvedMetadata["twitter"];
}) {
  if (!twitter) return null;
  const { card } = twitter;

  return MetaFilter([
    Meta({ name: "twitter:card", content: card }),
    Meta({ name: "twitter:site", content: twitter.site }),
    Meta({ name: "twitter:site:id", content: twitter.siteId }),
    Meta({ name: "twitter:creator", content: twitter.creator }),
    Meta({ name: "twitter:creator:id", content: twitter.creatorId }),
    Meta({ name: "twitter:title", content: twitter.title?.absolute }),
    Meta({ name: "twitter:description", content: twitter.description }),
    MultiMeta({
      namePrefix: "twitter:image",
      contents: normalizeMultiMetaContents(twitter.images)
    }),
    ...(card === "player"
      ? twitter.players.flatMap(player => [
          Meta({
            name: "twitter:player",
            content: player.playerUrl.toString()
          }),
          Meta({
            name: "twitter:player:stream",
            content: player.streamUrl.toString()
          }),
          Meta({ name: "twitter:player:width", content: player.width }),
          Meta({ name: "twitter:player:height", content: player.height })
        ])
      : []),
    ...(card === "app"
      ? [
          TwitterAppItem({ app: twitter.app, type: "iphone" }),
          TwitterAppItem({ app: twitter.app, type: "ipad" }),
          TwitterAppItem({ app: twitter.app, type: "googleplay" })
        ]
      : [])
  ]);
}

export function AppLinksMeta({
  appLinks
}: {
  appLinks: ResolvedMetadata["appLinks"];
}) {
  if (!appLinks) return null;
  return MetaFilter([
    MultiMeta({
      propertyPrefix: "al:ios",
      contents: normalizeMultiMetaContents(appLinks.ios)
    }),
    MultiMeta({
      propertyPrefix: "al:iphone",
      contents: normalizeMultiMetaContents(appLinks.iphone)
    }),
    MultiMeta({
      propertyPrefix: "al:ipad",
      contents: normalizeMultiMetaContents(appLinks.ipad)
    }),
    MultiMeta({
      propertyPrefix: "al:android",
      contents: normalizeMultiMetaContents(appLinks.android)
    }),
    MultiMeta({
      propertyPrefix: "al:windows_phone",
      contents: normalizeMultiMetaContents(appLinks.windows_phone)
    }),
    MultiMeta({
      propertyPrefix: "al:windows",
      contents: normalizeMultiMetaContents(appLinks.windows)
    }),
    MultiMeta({
      propertyPrefix: "al:windows_universal",
      contents: normalizeMultiMetaContents(appLinks.windows_universal)
    }),
    MultiMeta({
      propertyPrefix: "al:web",
      contents: normalizeMultiMetaContents(appLinks.web)
    })
  ]);
}
