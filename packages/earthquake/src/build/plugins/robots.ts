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

import type { Plugin } from "powerlines";
import type { EarthquakeBuildContext } from "../../types/build";
import { replacePathTokens } from "../utilities/paths";

/**
 * A Powerlines plugin to generate a robots.txt file based on the {@link https://en.wikipedia.org/wiki/Robots.txt#Standard | Robots Exclusion Standard}.
 *
 * @param outputPath - The output path for the robots.txt file.
 * @returns A Powerlines plugin.
 */
export function robots<
  TContext extends EarthquakeBuildContext = EarthquakeBuildContext
>(outputPath: string | false = "{publicPath}/robots.txt"): Plugin<TContext> {
  return {
    name: "earthquake:robots",
    enforce: "post",
    config() {
      return {
        earthquake: {
          robots: outputPath
        }
      };
    },
    configResolved() {
      if (this.config.earthquake.robots) {
        this.config.earthquake.robots = replacePathTokens(
          this,
          this.config.earthquake.robots
        );
      }
    },
    async writeBundle() {
      if (this.config.earthquake.robots) {
        this.debug(`Generating robots.txt at ${this.config.earthquake.robots}`);

        await this.fs.write(
          this.config.earthquake.robots,
          `User-Agent: *
Allow: /
Disallow: /private/
Sitemap: ${this.config.earthquake.baseUrl.toString()}/sitemap.xml
`
        );
      }
    }
  };
}
