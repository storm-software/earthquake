#!/usr/bin/env zx
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

import { slash } from "@stryke/path/slash";
import { chalk, echo, fs, path } from "zx";

try {
  echo`${chalk.whiteBright("⚙️  Generating the vendor distribution...")}`;

  fs.rmSync("./dist/vendor/", { recursive: true, force: true });
  fs.mkdirSync("./dist/vendor", { recursive: true });

  fs.globSync("./node_modules/react-server-dom-webpack/**/*.js", {
    withFileTypes: true
  }).forEach(file => {
    fs.cpSync(
      path.join(file.parentPath, file.name),
      `./dist/vendor/react-server-dom/${slash(file.parentPath)
        .replace(/\/node_modules\/react-server-dom-webpack/, "")
        .replace(/\/$/, "")
        .split("/")
        .pop()}/${file.name}`,
      {
        recursive: true,
        dereference: true
      }
    );
  });

  fs.rmSync("./dist/vendor/react-server-dom/node_modules", {
    recursive: true,
    force: true
  });

  echo`${chalk.green(" ✔ Successfully completed generating vendor distribution!")}`;
} catch (error) {
  echo`${chalk.red(
    error?.message
      ? error.message
      : "A failure occurred while generating the vendor distribution"
  )}`;

  process.exit(1);
}
