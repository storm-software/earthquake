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

import type { Icons, ViewportLayout } from "./types/metadata";

export const ViewportMetaKeys: { [k in keyof ViewportLayout]: string } = {
  width: "width",
  height: "height",
  initialScale: "initial-scale",
  minimumScale: "minimum-scale",
  maximumScale: "maximum-scale",
  viewportFit: "viewport-fit",
  userScalable: "user-scalable",
  interactiveWidget: "interactive-widget"
} as const;

export const IconKeys: (keyof Icons)[] = ["icon", "shortcut", "apple", "other"];
