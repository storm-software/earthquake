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

export interface EarthquakeRssSchema {
  title?: string;
  description?: string;
  pubDate?: Date;
  customData?: string;
  categories?: string[];
  author?: string;
  commentsUrl?: string;
  source?: { url: string; title: string };
  enclosure?: { url: string; length: number; type: string };
  link?: string;
  content?: string;
}

export interface RSSOptions {
  /**
   * Title of the RSS Feed
   */
  title: string;

  /**
   * Description of the RSS Feed
   */
  description: string;

  /**
   * Specify the base URL to use for RSS feed links.
   */
  site: string;

  /**
   * List of RSS feed items to render.
   */
  items: RSSFeedItem[];

  /**
   * Specify arbitrary metadata on opening <xml> tag
   */
  xmlns?: Record<string, string>;

  /**
   * Specifies a local custom XSL stylesheet. Ex. '/public/custom-feed.xsl'
   */
  stylesheet?: string | boolean;

  /**
   * Specify custom data in opening of file
   */
  customData?: string;

  /**
   * Whether to append a trailing slash to URLs
   */
  trailingSlash?: boolean;
}

export interface RSSFeedItem {
  /**
   * Link to item
   */
  link?: string;

  /**
   * Full content of the item. Should be valid HTML
   */
  content?: string;

  /**
   * Title of item
   */
  title?: string;

  /**
   * Publication date of item
   */
  pubDate?: Date;

  /**
   * Item description
   */
  description?: string;

  /**
   * Append some other XML-valid data to this item
   */
  customData?: string;

  /**
   * Categories or tags related to the item
   */
  categories?: string[];

  /**
   * The item author's email address
   */
  author?: string;

  /**
   * A URL of a page for comments related to the item
   */
  commentsUrl?: string;

  /**
   * The RSS channel that the item came from
   */
  source?: { url: string; title: string };

  /**
   * A media object that belongs to the item
   */
  enclosure?: { url: string; length: number; type: string };
}
