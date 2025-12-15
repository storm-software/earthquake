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

import type { AbsoluteTemplateString, TemplateString } from "./metadata";

export type Twitter =
  | TwitterSummary
  | TwitterSummaryLargeImage
  | TwitterPlayer
  | TwitterApp
  | TwitterMetadata;

interface TwitterMetadata {
  // defaults to card="summary"
  site?: string | undefined; // username for account associated to the site itself
  siteId?: string | undefined; // id for account associated to the site itself
  creator?: string | undefined; // username for the account associated to the creator of the content on the site
  creatorId?: string | undefined; // id for the account associated to the creator of the content on the site
  description?: string | undefined;
  title?: string | TemplateString | undefined;
  images?: TwitterImage | Array<TwitterImage> | undefined;
}
type TwitterSummary = TwitterMetadata & {
  card: "summary";
};
type TwitterSummaryLargeImage = TwitterMetadata & {
  card: "summary_large_image";
};
type TwitterPlayer = TwitterMetadata & {
  card: "player";
  players: TwitterPlayerDescriptor | Array<TwitterPlayerDescriptor>;
};
type TwitterApp = TwitterMetadata & {
  card: "app";
  app: TwitterAppDescriptor;
};
export interface TwitterAppDescriptor {
  id: {
    iphone?: string | number | undefined;
    ipad?: string | number | undefined;
    googleplay?: string | undefined;
  };
  url?:
    | {
        iphone?: string | URL | undefined;
        ipad?: string | URL | undefined;
        googleplay?: string | URL | undefined;
      }
    | undefined;
  name?: string | undefined;
}

type TwitterImage = string | TwitterImageDescriptor | URL;
interface TwitterImageDescriptor {
  url: string | URL;
  alt?: string | undefined;
  secureUrl?: string | URL | undefined;
  type?: string | undefined;
  width?: string | number | undefined;
  height?: string | number | undefined;
}
interface TwitterPlayerDescriptor {
  playerUrl: string | URL;
  streamUrl: string | URL;
  width: number;
  height: number;
}

interface ResolvedTwitterImage {
  url: string | URL;
  alt?: string | undefined;
  secureUrl?: string | URL | undefined;
  type?: string | undefined;
  width?: string | number | undefined;
  height?: string | number | undefined;
}
interface ResolvedTwitterSummary {
  site: string | null;
  siteId: string | null;
  creator: string | null;
  creatorId: string | null;
  description: string | null;
  title: AbsoluteTemplateString;
  images?: Array<ResolvedTwitterImage> | undefined;
}
type ResolvedTwitterPlayer = ResolvedTwitterSummary & {
  players: Array<TwitterPlayerDescriptor>;
};
type ResolvedTwitterApp = ResolvedTwitterSummary & {
  app: TwitterAppDescriptor;
};

export type ResolvedTwitterMetadata =
  | ({ card: "summary" } & ResolvedTwitterSummary)
  | ({ card: "summary_large_image" } & ResolvedTwitterSummary)
  | ({ card: "player" } & ResolvedTwitterPlayer)
  | ({ card: "app" } & ResolvedTwitterApp);
