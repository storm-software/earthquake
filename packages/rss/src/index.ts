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

import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { createCanonicalURL, isValidURL } from "./helpers";
import type { RSSOptions } from "./types";

export * from "./types";

export default async function getRssResponse(
  rssOptions: RSSOptions
): Promise<Response> {
  const rssString = await generateRSS(rssOptions);

  return new Response(rssString, {
    headers: {
      "Content-Type": "application/xml"
    }
  });
}

/**
 * Generate RSS 2.0 feed
 *
 * @see https://validator.w3.org/feed/docs/rss2.html
 *
 * @param rssOptions - Validated RSS options
 * @returns RSS feed as a string
 */
export async function generateRSS(rssOptions: RSSOptions): Promise<string> {
  const { items, site } = rssOptions;

  const xmlOptions = {
    ignoreAttributes: false,
    // Avoid correcting self-closing tags to standard tags
    // when using `customData`
    // https://github.com/withastro/astro/issues/5794
    suppressEmptyNode: true,
    suppressBooleanAttributes: false
  };
  const parser = new XMLParser(xmlOptions);
  const root: any = { "?xml": { "@_version": "1.0", "@_encoding": "UTF-8" } };
  if (typeof rssOptions.stylesheet === "string") {
    const isXSL = /\.xslt?$/i.test(rssOptions.stylesheet);
    root["?xml-stylesheet"] = {
      "@_href": rssOptions.stylesheet,
      ...(isXSL && { "@_type": "text/xsl" })
    };
  }
  root.rss = { "@_version": "2.0" };
  if (items.find(result => result.content)) {
    // the namespace to be added to the xmlns:content attribute to enable the <content> RSS feature
    const XMLContentNamespace = "http://purl.org/rss/1.0/modules/content/";
    root.rss["@_xmlns:content"] = XMLContentNamespace;
    // Ensure that the user hasn't tried to manually include the necessary namespace themselves
    if (
      rssOptions.xmlns?.content &&
      rssOptions.xmlns.content === XMLContentNamespace
    ) {
      delete rssOptions.xmlns.content;
    }
  }

  // xmlns
  if (rssOptions.xmlns) {
    for (const [k, v] of Object.entries(rssOptions.xmlns)) {
      root.rss[`@_xmlns:${k}`] = v;
    }
  }

  // title, description, customData
  root.rss.channel = {
    title: rssOptions.title,
    description: rssOptions.description,
    link: createCanonicalURL(site, rssOptions.trailingSlash, undefined)
  };
  if (typeof rssOptions.customData === "string")
    Object.assign(
      root.rss.channel,
      parser.parse(`<channel>${rssOptions.customData}</channel>`).channel
    );
  // items
  root.rss.channel.item = items.map(result => {
    const item: Record<string, unknown> = {};

    if (result.title) {
      item.title = result.title;
    }
    if (typeof result.link === "string") {
      // If the item's link is already a valid URL, don't mess with it.
      const itemLink = isValidURL(result.link)
        ? result.link
        : createCanonicalURL(result.link, rssOptions.trailingSlash, site);
      item.link = itemLink;
      item.guid = { "#text": itemLink, "@_isPermaLink": "true" };
    }
    if (result.description) {
      item.description = result.description;
    }
    if (result.pubDate) {
      item.pubDate = result.pubDate.toUTCString();
    }
    // include the full content of the post if the user supplies it
    if (typeof result.content === "string") {
      item["content:encoded"] = result.content;
    }
    if (typeof result.customData === "string") {
      Object.assign(
        item,
        parser.parse(`<item>${result.customData}</item>`).item
      );
    }
    if (Array.isArray(result.categories)) {
      item.category = result.categories;
    }
    if (typeof result.author === "string") {
      item.author = result.author;
    }
    if (typeof result.commentsUrl === "string") {
      item.comments = isValidURL(result.commentsUrl)
        ? result.commentsUrl
        : createCanonicalURL(
            result.commentsUrl,
            rssOptions.trailingSlash,
            site
          );
    }
    if (result.source) {
      item.source = parser.parse(
        `<source url="${result.source.url}">${result.source.title}</source>`
      ).source;
    }
    if (result.enclosure) {
      const enclosureURL = isValidURL(result.enclosure.url)
        ? result.enclosure.url
        : createCanonicalURL(
            result.enclosure.url,
            rssOptions.trailingSlash,
            site
          );
      item.enclosure = parser.parse(
        `<enclosure url="${enclosureURL}" length="${result.enclosure.length}" type="${result.enclosure.type}"/>`
      ).enclosure;
    }
    return item;
  });

  return new XMLBuilder(xmlOptions).build(root);
}
