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

import { isMainThread } from "node:worker_threads";
import { onExit } from "signal-exit";
import { initTraceSubscriber } from "../binding.cjs";

if (!import.meta.browserBuild && isMainThread) {
  const subscriberGuard = initTraceSubscriber();
  onExit(() => {
    subscriberGuard?.close();
  });
}
