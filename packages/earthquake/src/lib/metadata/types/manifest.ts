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

type ClientModeEnum =
  | "auto"
  | "focus-existing"
  | "navigate-existing"
  | "navigate-new";

interface File {
  name: string;
  accept: string | string[];
}

interface Icon {
  src: string;
  type?: string | undefined;
  sizes?: string | undefined;
  purpose?: "any" | "maskable" | "monochrome" | undefined;
}

export interface Manifest {
  background_color?: string | undefined;
  categories?: string[] | undefined;
  description?: string | undefined;
  dir?: "ltr" | "rtl" | "auto" | undefined;
  display?: "fullscreen" | "standalone" | "minimal-ui" | "browser" | undefined;
  display_override?:
    | (
        | "fullscreen"
        | "standalone"
        | "minimal-ui"
        | "browser"
        | "window-controls-overlay"
      )[]
    | undefined;
  file_handlers?:
    | {
        action: string;
        accept: {
          [mimeType: string]: string[];
        };
      }[]
    | undefined;
  icons?: Icon[] | undefined;
  id?: string | undefined;
  lang?: string | undefined;
  launch_handler?:
    | {
        client_mode: ClientModeEnum | ClientModeEnum[];
      }
    | undefined;
  name?: string | undefined;
  orientation?:
    | "any"
    | "natural"
    | "landscape"
    | "portrait"
    | "portrait-primary"
    | "portrait-secondary"
    | "landscape-primary"
    | "landscape-secondary"
    | undefined;
  prefer_related_applications?: boolean | undefined;
  protocol_handlers?:
    | {
        protocol: string;
        url: string;
      }[]
    | undefined;
  related_applications?:
    | {
        platform: string;
        url: string;
        id?: string | undefined;
      }[]
    | undefined;
  scope?: string | undefined;
  screenshots?:
    | {
        form_factor?: "narrow" | "wide" | undefined;
        label?: string | undefined;
        platform?:
          | "android"
          | "chromeos"
          | "ipados"
          | "ios"
          | "kaios"
          | "macos"
          | "windows"
          | "xbox"
          | "chrome_web_store"
          | "itunes"
          | "microsoft-inbox"
          | "microsoft-store"
          | "play"
          | undefined;
        src: string;
        type?: string | undefined;
        sizes?: string | undefined;
      }[]
    | undefined;
  share_target?:
    | {
        action: string;
        method?: "get" | "post" | "GET" | "POST" | undefined;
        enctype?:
          | "application/x-www-form-urlencoded"
          | "multipart/form-data"
          | undefined;
        params: {
          title?: string | undefined;
          text?: string | undefined;
          url?: string | undefined;
          files?: File | File[] | undefined;
        };
      }
    | undefined;
  short_name?: string | undefined;
  shortcuts?:
    | {
        name: string;
        short_name?: string | undefined;
        description?: string | undefined;
        url: string;
        icons?: Icon[] | undefined;
      }[]
    | undefined;
  start_url?: string | undefined;
  theme_color?: string | undefined;
}
