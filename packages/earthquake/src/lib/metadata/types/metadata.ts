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

import type {
  AlternateURLs,
  Languages,
  ResolvedAlternateURLs
} from "./alternative-urls";
import type { Manifest as ManifestFile } from "./manifest";
import type { OpenGraph, ResolvedOpenGraph } from "./opengraph";
import type { ResolvedTwitterMetadata, Twitter } from "./twitter";

// When rendering applink meta tags add a namespace tag before each array instance
// if more than one member exists.
// ref: https://developers.facebook.com/docs/applinks/metadata-reference

export interface AppLinks {
  ios?: AppLinksApple | Array<AppLinksApple> | undefined;
  iphone?: AppLinksApple | Array<AppLinksApple> | undefined;
  ipad?: AppLinksApple | Array<AppLinksApple> | undefined;
  android?: AppLinksAndroid | Array<AppLinksAndroid> | undefined;
  windows_phone?: AppLinksWindows | Array<AppLinksWindows> | undefined;
  windows?: AppLinksWindows | Array<AppLinksWindows> | undefined;
  windows_universal?: AppLinksWindows | Array<AppLinksWindows> | undefined;
  web?: AppLinksWeb | Array<AppLinksWeb> | undefined;
}

export interface ResolvedAppLinks {
  ios?: Array<AppLinksApple> | undefined;
  iphone?: Array<AppLinksApple> | undefined;
  ipad?: Array<AppLinksApple> | undefined;
  android?: Array<AppLinksAndroid> | undefined;
  windows_phone?: Array<AppLinksWindows> | undefined;
  windows?: Array<AppLinksWindows> | undefined;
  windows_universal?: Array<AppLinksWindows> | undefined;
  web?: Array<AppLinksWeb> | undefined;
}

export interface AppLinksApple {
  url: string | URL;
  app_store_id?: string | number | undefined;
  app_name?: string | undefined;
}

export interface AppLinksAndroid {
  package: string;
  url?: string | URL | undefined;
  class?: string | undefined;
  app_name?: string | undefined;
}

export interface AppLinksWindows {
  url: string | URL;
  app_id?: string | undefined;
  app_name?: string | undefined;
}

export interface AppLinksWeb {
  url: string | URL;
  should_fallback?: boolean | undefined;
}

// Apple Itunes APp
// https://developer.apple.com/documentation/webkit/promoting_apps_with_smart_app_banners
export interface ItunesApp {
  appId: string;
  appArgument?: string | undefined;
}

// Viewport meta structure
// https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag
// intentionally leaving out user-scalable, use a string if you want that behavior
export interface ViewportLayout {
  width?: string | number | undefined;
  height?: string | number | undefined;
  initialScale?: number | undefined;
  minimumScale?: number | undefined;
  maximumScale?: number | undefined;
  userScalable?: boolean | undefined;
  viewportFit?: "auto" | "cover" | "contain" | undefined;
  interactiveWidget?:
    | "resizes-visual"
    | "resizes-content"
    | "overlays-content"
    | undefined;
}

// Apple Web App
// https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html
// https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
export interface AppleWebApp {
  // default true
  capable?: boolean | undefined;
  title?: string | undefined;
  startupImage?: AppleImage | Array<AppleImage> | undefined;
  // default "default"
  statusBarStyle?: "default" | "black" | "black-translucent" | undefined;
}
export type AppleImage = string | AppleImageDescriptor;
export interface AppleImageDescriptor {
  url: string;
  media?: string | undefined;
}
export interface ResolvedAppleWebApp {
  capable: boolean;
  title?: string | null | undefined;
  startupImage?: AppleImageDescriptor[] | null | undefined;
  statusBarStyle?: "default" | "black" | "black-translucent" | undefined;
}

export type Facebook = FacebookAppId | FacebookAdmins;
export interface FacebookAppId {
  appId: string;
  admins?: never | undefined;
}
export interface FacebookAdmins {
  appId?: never | undefined;
  admins: string | string[];
}
export interface ResolvedFacebook {
  appId?: string | undefined;
  admins?: string[] | undefined;
}

export type Pinterest = PinterestRichPin;
export interface PinterestRichPin {
  richPin: string | boolean;
}

export interface ResolvedPinterest {
  richPin?: string;
}

// Format Detection
// This is a poorly specified metadata export type that is supposed to
// control whether the device attempts to convert text that matches
// certain formats into links for action. The most supported example
// is how mobile devices detect phone numbers and make them into links
// that can initiate a phone call
// https://www.goodemailcode.com/email-code/template.html
export interface FormatDetection {
  telephone?: boolean | undefined;
  date?: boolean | undefined;
  address?: boolean | undefined;
  email?: boolean | undefined;
  url?: boolean | undefined;
}

export interface DeprecatedMetadataFields {
  /**
   * Deprecated options that have a preferred method
   * @deprecated Use appleWebApp instead
   */
  "apple-touch-fullscreen"?: never | undefined;

  /**
   * Obsolete since iOS 7.
   * @see https://web.dev/apple-touch-icon/
   * @deprecated Use icons.apple instead
   */
  "apple-touch-icon-precomposed"?: never | undefined;
}

export type TemplateString =
  | DefaultTemplateString
  | AbsoluteTemplateString
  | AbsoluteString;
export interface DefaultTemplateString {
  default: string;
  template: string;
}
export interface AbsoluteTemplateString {
  absolute: string;
  template: string | null;
}
export interface AbsoluteString {
  absolute: string;
}

export interface Author {
  // renders as <link rel="author"...
  url?: string | URL | undefined;
  // renders as <meta name="author"...
  name?: string | undefined;
}

// does not include "unsafe-URL". to use this users should
// use '"unsafe-URL" as ReferrerEnum'
export type ReferrerEnum =
  | "no-referrer"
  | "origin"
  | "no-referrer-when-downgrade"
  | "origin-when-cross-origin"
  | "same-origin"
  | "strict-origin"
  | "strict-origin-when-cross-origin";

export type ColorSchemeEnum =
  | "normal"
  | "light"
  | "dark"
  | "light dark"
  | "dark light"
  | "only light";

interface RobotsInfo {
  // all and none will be inferred from index/follow boolean options
  index?: boolean | undefined;
  follow?: boolean | undefined;

  /** @deprecated set index to false instead */
  noindex?: never | undefined;
  /** @deprecated set follow to false instead */
  nofollow?: never | undefined;

  noarchive?: boolean | undefined;
  nosnippet?: boolean | undefined;
  noimageindex?: boolean | undefined;
  nocache?: boolean | undefined;
  notranslate?: boolean | undefined;
  indexifembedded?: boolean | undefined;
  nositelinkssearchbox?: boolean | undefined;
  unavailable_after?: string | undefined;
  "max-video-preview"?: number | string | undefined;
  "max-image-preview"?: "none" | "standard" | "large" | undefined;
  "max-snippet"?: number | undefined;
}
export type Robots = RobotsInfo & {
  // if you want to specify an alternate robots just for google
  googleBot?: string | RobotsInfo | undefined;
};

export interface ResolvedRobots {
  basic: string | null;
  googleBot: string | null;
}

export type IconURL = string | URL;
export type Icon = IconURL | IconDescriptor;
export interface IconDescriptor {
  url: string | URL;
  type?: string | undefined;
  sizes?: string | undefined;
  color?: string | undefined;
  /** defaults to rel="icon" unless superseded by Icons map */
  rel?: string | undefined;
  media?: string | undefined;
  /**
   * @see https://developer.mozilla.org/docs/Web/API/HTMLImageElement/fetchPriority
   */
  fetchPriority?: "high" | "low" | "auto" | undefined;
}

export interface Icons {
  /** rel="icon" */
  icon?: Icon | Icon[] | undefined;
  /** rel="shortcut icon" */
  shortcut?: Icon | Icon[] | undefined;
  /**
   * @see https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
   * rel="apple-touch-icon"
   */
  apple?: Icon | Icon[] | undefined;
  /** rel inferred from descriptor, defaults to "icon" */
  other?: IconDescriptor | IconDescriptor[] | undefined;
}

export interface Verification {
  google?: null | string | number | (string | number)[] | undefined;
  yahoo?: null | string | number | (string | number)[] | undefined;
  yandex?: null | string | number | (string | number)[] | undefined;
  me?: null | string | number | (string | number)[] | undefined;
  // if you ad-hoc additional verification
  other?:
    | {
        [name: string]: string | number | (string | number)[];
      }
    | undefined;
}

export interface ResolvedVerification {
  google?: null | (string | number)[] | undefined;
  yahoo?: null | (string | number)[] | undefined;
  yandex?: null | (string | number)[] | undefined;
  me?: null | (string | number)[] | undefined;
  other?:
    | {
        [name: string]: (string | number)[];
      }
    | undefined;
}

export interface ResolvedIcons {
  icon: IconDescriptor[];
  apple: IconDescriptor[];
  shortcut?: IconDescriptor[] | undefined;
  other?: IconDescriptor[] | undefined;
}

export interface ThemeColorDescriptor {
  color: string;
  media?: string | undefined;
}

export interface Restriction {
  relationship: "allow" | "deny";
  content: string;
}

export interface Videos {
  title: string;
  thumbnail_loc: string;
  description: string;
  content_loc?: string | undefined;
  player_loc?: string | undefined;
  duration?: number | undefined;
  expiration_date?: Date | string | undefined;
  rating?: number | undefined;
  view_count?: number | undefined;
  publication_date?: Date | string | undefined;
  family_friendly?: "yes" | "no" | undefined;
  restriction?: Restriction | undefined;
  platform?: Restriction | undefined;
  requires_subscription?: "yes" | "no" | undefined;
  uploader?:
    | {
        info?: string | undefined;
        content?: string | undefined;
      }
    | undefined;
  live?: "yes" | "no" | undefined;
  tag?: string | undefined;
}

/**
 * Metadata interface to describe all the metadata fields that can be set in a document.
 *
 * @remarks
 * This interface covers all the metadata fields available in Next.js including title, description,
 * icons, openGraph, twitter, and more. Fields such as `metadataBase` help in composing absolute URLs
 * from relative ones. The `title` field supports both simple strings and a template object with `default`,
 * `template`, and `absolute` properties.
 *
 * @example
 * ```tsx
 * // Static metadata export in a layout or page:
 * import type { Metadata } from 'next'
 *
 * export const metadata: Metadata = {
 *   metadataBase: new URL('https://example.com'),
 *   title: { default: 'My Site', template: '%s | My Site' },
 *   description: 'Welcome to My Site',
 *   alternates: {
 *     canonical: 'https://example.com',
 *     languages: {
 *       'en-US': 'https://example.com/en-US',
 *       'de-DE': 'https://example.com/de-DE'
 *     }
 *   },
 *   openGraph: {
 *     title: 'My Site',
 *     description: 'Welcome to My Site',
 *     url: 'https://example.com',
 *     siteName: 'My Site',
 *     images: [{ url: 'https://example.com/og.png' }]
 *   },
 * }
 * ```
 */
export interface Metadata extends DeprecatedMetadataFields {
  /**
   * The base path and origin for absolute URLs in various metadata fields.
   *
   * @remarks
   * When relative URLs (for Open Graph images, alternates, etc.) are used, they are composed with this base.
   * If not provided, Next.js will populate a default value based on environment variables.
   */
  metadataBase?: null | URL | undefined;

  /**
   * The document title.
   *
   * @remarks
   * The title can be a simple string (e.g., `"My Blog"`) or an object with:
   * - `default`: A fallback title for child segments.
   * - `template`: A title template (e.g., `"%s | My Website"`) applied to child titles.
   * - `absolute`: A title that overrides parent templates.
   *
   * @example
   * ```tsx
   * // As a simple string:
   * title: "My Blog"
   *
   * // As a template object:
   * title: { default: "Dashboard", template: "%s | My Website" }
   *
   * // Using absolute value (ignores parent template):
   * title: { absolute: "My Blog", template: "%s | My Website" }
   * ```
   */
  title?: null | string | TemplateString | undefined;

  /**
   * The document description, and optionally the Open Graph and Twitter descriptions.
   *
   * @example
   * ```tsx
   * description: "My Blog Description"
   * // Renders: <meta name="description" content="My Blog Description" />
   * ```
   */
  description?: null | string | undefined;

  // Standard metadata names
  // https://developer.mozilla.org/docs/Web/HTML/Element/meta/name

  /**
   * The application name.
   *
   * @example
   * ```tsx
   * applicationName: "My Blog"
   * // Renders: <meta name="application-name" content="My Blog" />
   * ```
   */
  applicationName?: null | string | undefined;

  /**
   * The authors of the document.
   *
   * @example
   * ```tsx
   * authors: [{ name: "Next.js Team", url: "https://nextjs.org" }]
   * // Renders:
   * // <meta name="author" content="Next.js Team" />
   * // <link rel="author" href="https://nextjs.org" />
   * ```
   */
  authors?: null | Author | Array<Author> | undefined;

  /**
   * The generator used for the document.
   *
   * @example
   * ```tsx
   * generator: "Next.js"
   * // Renders: <meta name="generator" content="Next.js" />
   * ```
   */
  generator?: null | string | undefined;

  /**
   * The keywords for the document.
   *
   * @remarks
   * When an array is provided, keywords are flattened into a comma-separated string.
   *
   * @example
   * ```tsx
   * keywords: "nextjs, react, blog"
   * // or
   * keywords: ["react", "server components"]
   * ```
   */
  keywords?: null | string | Array<string> | undefined;

  /**
   * The referrer setting for the document.
   *
   * @example
   * ```tsx
   * referrer: "origin"
   * // Renders: <meta name="referrer" content="origin" />
   * ```
   */
  referrer?: null | ReferrerEnum | undefined;

  /**
   * The theme color for the document.
   *
   * @deprecated Use the new viewport configuration (`export const viewport: Viewport = { ... }`) instead.
   */
  themeColor?:
    | null
    | string
    | ThemeColorDescriptor
    | ThemeColorDescriptor[]
    | undefined;

  /**
   * The color scheme for the document.
   *
   * @deprecated Use the new viewport configuration (`export const viewport: Viewport = { ... }`) instead.
   */
  colorScheme?: null | ColorSchemeEnum | undefined;

  /**
   * The viewport setting for the document.
   *
   * @deprecated Use the new viewport configuration (`export const viewport: Viewport = { ... }`) instead.
   */
  viewport?: null | string | ViewportLayout | undefined;

  /**
   * The creator of the document.
   *
   * @example
   * ```tsx
   * creator: "Next.js Team"
   * // Renders: <meta name="creator" content="Next.js Team" />
   * ```
   */
  creator?: null | string | undefined;

  /**
   * The publisher of the document.
   *
   * @example
   * ```tsx
   * publisher: "Vercel"
   * // Renders: <meta name="publisher" content="Vercel" />
   * ```
   */
  publisher?: null | string | undefined;

  // https://developer.mozilla.org/docs/Web/HTML/Element/meta/name#other_metadata_names

  /**
   * The robots setting for the document.
   *
   * @remarks
   * Can be a string (e.g., "index, follow") or an object with more granular rules.
   *
   * @example
   * ```tsx
   * robots: "index, follow"
   * // or
   * robots: { index: true, follow: true }
   * ```
   *
   * @see https://developer.mozilla.org/docs/Glossary/Robots.txt
   */
  robots?: null | string | Robots | undefined;

  /**
   * The canonical and alternate URLs for the document.
   *
   * @remarks
   * This field allows defining a canonical URL as well as alternate URLs (such as for multiple languages).
   *
   * @example
   * ```tsx
   * alternates: {
   *   canonical: "https://example.com",
   *   languages: {
   *     "en-US": "https://example.com/en-US"
   *   }
   * }
   * ```
   */
  alternates?: null | AlternateURLs | undefined;

  /**
   * The icons for the document. Defaults to rel="icon".
   *
   * @remarks
   * You can specify a simple URL or an object to differentiate between icon types (e.g., apple-touch-icon).
   *
   * @example
   * ```tsx
   * icons: "https://example.com/icon.png"
   * // or
   * icons: {
   *   icon: "https://example.com/icon.png",
   *   apple: "https://example.com/apple-icon.png"
   * }
   * ```
   *
   * @see https://developer.mozilla.org/docs/Web/HTML/Attributes/rel#attr-icon
   */
  icons?: null | IconURL | Array<Icon> | Icons | undefined;

  /**
   * A web application manifest, as defined in the Web Application Manifest specification.
   *
   * @example
   * ```tsx
   * manifest: "https://example.com/manifest.json"
   * // Renders: <link rel="manifest" href="https://example.com/manifest.json" />
   * ```
   *
   * @see https://developer.mozilla.org/docs/Web/Manifest
   */
  manifest?: null | string | URL | undefined;

  /**
   * The Open Graph metadata for the document.
   *
   * @remarks
   * Follows the Open Graph protocol to enrich link previews.
   *
   * @example
   * ```tsx
   * openGraph: {
   *   type: "website",
   *   url: "https://example.com",
   *   title: "My Website",
   *   description: "My Website Description",
   *   siteName: "My Website",
   *   images: [{ url: "https://example.com/og.png" }]
   * }
   * ```
   *
   * @see https://ogp.me/
   */
  openGraph?: null | OpenGraph | undefined;

  /**
   * The Twitter metadata for the document.
   *
   * @remarks
   * - Used for configuring Twitter Cards and can include details such as `card`, `site`, and `creator`.
   * - Notably, more sites than just Twitter (now X) use this format.
   *
   * @example
   * ```tsx
   * twitter: {
   *   card: "summary_large_image",
   *   site: "@site",
   *   creator: "@creator",
   *   images: "https://example.com/og.png"
   * }
   * ```
   */
  twitter?: null | Twitter | undefined;

  /**
   * The Facebook metadata for the document.
   *
   * @remarks
   * Specify either `appId` or `admins` (but not both) to configure Facebook integration.
   *
   * @example
   * ```tsx
   * facebook: { appId: "12345678" }
   * // Renders <meta property="fb:app_id" content="12345678" />
   * // or
   * facebook: { admins: ["12345678"] }
   * // Renders <meta property="fb:admins" content="12345678" />
   * ```
   */
  facebook?: null | Facebook | undefined;

  /**
   * The Pinterest metadata for the document to choose whether opt out of rich pin data.
   *
   * @example
   * ```tsx
   * pinterest: { richPin: true }
   * // Renders <meta name="pinterest-rich-pin" content="true" />
   * ```
   */
  pinterest?: null | Pinterest;

  /**
   * The common verification tokens for the document.
   *
   * @example
   * ```tsx
   * verification: { google: "1234567890", yandex: "1234567890", "me": "1234567890" }
   * // Renders <meta name="google-site-verification" content="1234567890" />
   * // <meta name="yandex-verification" content="1234567890" />
   * // <meta name="me" content="@me" />
   * ```
   */
  verification?: Verification | undefined;

  /**
   * The Apple web app metadata for the document.
   *
   * @example
   * ```tsx
   * appleWebApp: { capable: true, title: "My Website", statusBarStyle: "black-translucent" }
   * ```
   *
   * @see https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html
   */
  appleWebApp?: null | boolean | AppleWebApp | undefined;

  /**
   * Indicates whether devices should interpret certain formats (such as telephone numbers) as actionable links.
   *
   * @example
   * ```tsx
   * formatDetection: { telephone: false }
   * // Renders: <meta name="format-detection" content="telephone=no" />
   * ```
   */
  formatDetection?: null | FormatDetection | undefined;

  /**
   * The metadata for the iTunes App.
   *
   * @remarks
   * Adds the `name="apple-itunes-app"` meta tag.
   *
   * @example
   * ```tsx
   * itunes: { app: { id: "123456789", affiliateData: "123456789", appArguments: "123456789" } }
   * // Renders <meta name="apple-itunes-app" content="app-id=123456789, affiliate-data=123456789, app-arguments=123456789" />
   * ```
   */
  itunes?: null | ItunesApp | undefined;

  /**
   * A brief description of the web page.
   *
   * @remarks
   * Rendered as the `abstract` meta tag. This is *not recommended* as it is superseded by `description`.
   *
   * @example
   * ```tsx
   * abstract: "My Website Description"
   * // Renders <meta name="abstract" content="My Website Description" />
   * ```
   */
  abstract?: null | string | undefined;

  /**
   * The Facebook AppLinks metadata for the document.
   *
   * @example
   * ```tsx
   * appLinks: {
   *   ios: { appStoreId: "123456789", url: "https://example.com" },
   *   android: { packageName: "com.example", url: "https://example.com" }
   * }
   *
   * // Renders
   * <meta property="al:ios:app_store_id" content="123456789" />
   * <meta property="al:ios:url" content="https://example.com" />
   * <meta property="al:android:package" content="com.example" />
   * <meta property="al:android:url" content="https://example.com" />
   * ```
   */
  appLinks?: null | AppLinks | undefined;

  /**
   * The archives link rel property.
   *
   * @example
   * ```tsx
   * archives: "https://example.com/archives"
   * // Renders <link rel="archives" href="https://example.com/archives" />
   * ```
   */
  archives?: null | string | Array<string> | undefined;

  /**
   * The assets link rel property.
   *
   * @example
   * ```tsx
   * assets: "https://example.com/assets"
   * // Renders <link rel="assets" href="https://example.com/assets" />
   * ```
   */
  assets?: null | string | Array<string> | undefined;

  /**
   * The bookmarks link rel property.
   *
   * @remarks
   * Although technically against the HTML spec, this is used in practice.
   *
   * @example
   * ```tsx
   * bookmarks: "https://example.com/bookmarks"
   * // Renders <link rel="bookmarks" href="https://example.com/bookmarks" />
   * ```
   */
  bookmarks?: null | string | Array<string> | undefined;

  /**
   * The pagination link rel properties.
   *
   * @example
   * ```tsx
   * pagination: {
   *   previous: "https://example.com/items?page=1",
   *   next: "https://example.com/items?page=3"
   * }
   *
   * // Renders
   * <link rel="prev" href="https://example.com/items?page=1" />
   * <link rel="next" href="https://example.com/items?page=3" />
   * ```
   *
   * @see https://developers.google.com/search/blog/2011/09/pagination-with-relnext-and-relprev
   */
  pagination?: {
    previous?: null | string | URL | undefined;
    next?: null | string | URL | undefined;
  };

  /**
   * The category meta name property.
   *
   * @example
   * ```tsx
   * category: "My Category"
   * // Renders <meta name="category" content="My Category" />
   * ```
   */
  category?: null | string | undefined;

  /**
   * The classification meta name property.
   *
   * @example
   * ```tsx
   * classification: "My Classification"
   * // Renders <meta name="classification" content="My Classification" />
   * ```
   */
  classification?: null | string | undefined;

  /**
   * Arbitrary name/value pairs for additional metadata.
   *
   * @remarks
   * Use this field to define custom meta tags that are not directly supported.
   *
   * @example
   * ```tsx
   * other: { custom: ["meta1", "meta2"] }
   * ```
   */
  other?:
    | ({
        [name: string]: string | number | Array<string | number>;
      } & DeprecatedMetadataFields)
    | undefined;
}

/**
 * ResolvedMetadata represents the fully processed metadata after defaults are applied
 * and relative URLs are composed with `metadataBase`.
 */
export interface ResolvedMetadata extends DeprecatedMetadataFields {
  // origin and base path for absolute urls for various metadata links such as
  // opengraph-image
  metadataBase: null | URL;

  // The Document title and template if defined
  title: null | AbsoluteTemplateString;

  // The Document description, and optionally the opengraph and twitter descriptions
  description: null | string;

  // Standard metadata names
  // https://developer.mozilla.org/docs/Web/HTML/Element/meta/name
  applicationName: null | string;
  authors: null | Array<Author>;
  generator: null | string;
  // if you provide an array it will be flattened into a single tag with comma separation
  keywords: null | Array<string>;
  referrer: null | ReferrerEnum;

  /**
   * @deprecated Use the new viewport configuration (`export const viewport: Viewport = { ... }`) instead.
   */
  themeColor: null | ThemeColorDescriptor[];

  /**
   * @deprecated Use the new viewport configuration (`export const viewport: Viewport = { ... }`) instead.
   */
  colorScheme: null | ColorSchemeEnum;

  /**
   * @deprecated Use the new viewport configuration (`export const viewport: Viewport = { ... }`) instead.
   */
  viewport: null | string;

  creator: null | string;
  publisher: null | string;

  // https://developer.mozilla.org/docs/Web/HTML/Element/meta/name#other_metadata_names
  robots: null | ResolvedRobots;

  // The canonical and alternate URLs for this location
  alternates: null | ResolvedAlternateURLs;

  // Defaults to rel="icon" but the Icons type can be used
  // to get more specific about rel types
  icons: null | ResolvedIcons;

  openGraph: null | ResolvedOpenGraph;

  manifest: null | string | URL;

  twitter: null | ResolvedTwitterMetadata;

  facebook: null | ResolvedFacebook;

  pinterest: null | ResolvedPinterest;

  // common verification tokens
  verification: null | ResolvedVerification;

  // Apple web app metadata
  // https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html
  appleWebApp: null | ResolvedAppleWebApp;

  // Should devices try to interpret various formats and make actionable links
  // out of them? The canonical example is telephone numbers on mobile that can
  // be clicked to dial
  formatDetection: null | FormatDetection;

  // meta name="apple-itunes-app"
  itunes: null | ItunesApp;

  // meta name="abstract"
  // A brief description of what this web-page is about.
  // Not recommended, superseded by description.
  // https://www.metatags.org/all-meta-tags-overview/meta-name-abstract/
  abstract: null | string;

  // Facebook AppLinks
  appLinks: null | ResolvedAppLinks;

  // link rel properties
  archives: null | Array<string>;
  assets: null | Array<string>;
  bookmarks: null | Array<string>; // This is technically against HTML spec but is used in wild
  pagination: {
    previous: null | string;
    next: null | string;
  };

  // meta name properties
  category: null | string;
  classification: null | string;
  other:
    | null
    | ({
        [name: string]: string | number | Array<string | number>;
      } & DeprecatedMetadataFields);
}

export interface RobotsFile {
  // Apply rules for all
  rules:
    | {
        userAgent?: string | string[] | undefined;
        allow?: string | string[] | undefined;
        disallow?: string | string[] | undefined;
        crawlDelay?: number | undefined;
      }
    // Apply rules for specific user agents
    | Array<{
        userAgent: string | string[];
        allow?: string | string[] | undefined;
        disallow?: string | string[] | undefined;
        crawlDelay?: number | undefined;
      }>;
  sitemap?: string | string[] | undefined;
  host?: string | undefined;
}

export type SitemapFile = Array<{
  url: string;
  lastModified?: string | Date | undefined;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never"
    | undefined;
  priority?: number | undefined;
  alternates?:
    | {
        languages?: Languages<string> | undefined;
      }
    | undefined;
  images?: string[] | undefined;
  videos?: Videos[] | undefined;
}>;

export type ResolvingMetadata = Promise<ResolvedMetadata>;
// eslint-disable-next-line ts/no-namespace
export declare namespace MetadataRoute {
  export type Robots = RobotsFile;
  export type Sitemap = SitemapFile;
  export type Manifest = ManifestFile;
}

/**
 * Interface for the viewport configuration.
 *
 * @remarks
 * This configuration allows defining properties such as width, initial scale, theme colors,
 * and color scheme.
 *
 * @example
 * ```tsx
 * export const viewport: Viewport = {
 *   width: "device-width",
 *   initialScale: 1,
 *   themeColor: [
 *     { media: "(prefers-color-scheme: dark)", color: "#000000" },
 *     { media: "(prefers-color-scheme: light)", color: "#ffffff" }
 *   ],
 *   colorScheme: "dark"
 * }
 * ```
 */
export interface Viewport extends ViewportLayout {
  /**
   * The theme color for the document.
   *
   * @example
   * ```tsx
   * themeColor: "#000000"
   * // Renders <meta name="theme-color" content="#000000" />
   *
   * themeColor: { media: "(prefers-color-scheme: dark)", color: "#000000" }
   * // Renders <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
   *
   * themeColor: [
   *  { media: "(prefers-color-scheme: dark)", color: "#000000" },
   *  { media: "(prefers-color-scheme: light)", color: "#ffffff" }
   * ]
   * // Renders <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
   * // Renders <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
   * ```
   */
  themeColor?:
    | null
    | string
    | ThemeColorDescriptor
    | ThemeColorDescriptor[]
    | undefined;

  /**
   * The color scheme for the document.
   *
   * @example
   * ```tsx
   * colorScheme: "dark"
   * // Renders <meta name="color-scheme" content="dark" />
   * ```
   */
  colorScheme?: null | ColorSchemeEnum | undefined;
}

export type ResolvingViewport = Promise<Viewport>;

export interface ResolvedViewport extends ViewportLayout {
  themeColor: null | ThemeColorDescriptor[];
  colorScheme: null | ColorSchemeEnum;
}
