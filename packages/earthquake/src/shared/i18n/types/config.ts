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

export type I18NDomains = readonly DomainLocale[];

export interface I18NConfig {
  defaultLocale: string;
  domains?: I18NDomains;
  localeDetection?: false;
  locales: readonly string[];
}

export interface DomainLocale {
  defaultLocale: string;
  domain: string;
  http?: true;
  locales?: readonly string[];
}
