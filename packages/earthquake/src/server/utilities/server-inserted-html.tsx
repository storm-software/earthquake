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

// Provider for the `useServerInsertedHtml` API to register callbacks to insert
// elements into the Html stream.

import type { JSX, ReactNode } from "react";
import * as React from "react";
import { ServerInsertedHtmlContext } from "../../shared/contexts/server-inserted-html";

/**
 * Creates a provider and renderer for server-inserted html.
 *
 * @returns An object containing the `ServerInsertedHtmlProvider` component and the `renderServerInsertedHtml` function.
 */
export function createServerInsertedHtml() {
  const serverInsertedHtmlCallbacks: (() => ReactNode)[] = [];
  const addInsertedHtml = (handler: () => ReactNode) => {
    serverInsertedHtmlCallbacks.push(handler);
  };

  return {
    ServerInsertedHtmlProvider({
      children
    }: {
      children: JSX.Element;
    }): JSX.Element {
      return (
        <ServerInsertedHtmlContext value={addInsertedHtml}>
          {children}
        </ServerInsertedHtmlContext>
      );
    },
    renderServerInsertedHtml(): JSX.Element[] {
      return serverInsertedHtmlCallbacks.map((callback, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={`__earthquake_server_inserted__${index}`}>
          {callback()}
        </React.Fragment>
      ));
    }
  };
}
