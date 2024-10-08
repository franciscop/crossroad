import React, { useCallback, useEffect, useState } from "react";

import Context from "./Context.js";
import { parse, stringify } from "./helpers/format.js";
import getHref from "./helpers/getHref.js";
import isServer from "./helpers/isServer.js";

export default ({ scrollUp, url: baseUrl, children }) => {
  const init = baseUrl || (isServer() ? "/" : window.location.href);
  const [url, setStateUrl] = useState(() => parse(init));

  // Memoize the callback so it doesn't trigger remounts
  const setUrl = useCallback((newUrl, { mode = "push" } = {}) => {
    if (!history[mode + "State"]) throw new Error(`Invalid mode "${mode}"`);

    // Need to use the callback style so that it's stable and doesn't need to
    // be remounted every time
    setStateUrl((prev) => {
      // Accepts callbacks
      newUrl = typeof newUrl === "function" ? newUrl(prev) : newUrl;

      // Don't update it if it's the same
      if (stringify(prev) === stringify(newUrl)) return prev;

      // Update the browser
      history[mode + "State"]({}, null, stringify(newUrl));

      if (scrollUp) {
        window.scrollTo(0, 0);
      }

      // Add the entry to the current state, refresh whatever needs refreshing
      return parse(newUrl);
    });
  }, []);

  // Effects for the browser
  useEffect(() => {
    // The server doesn't have any of these fancy handlers
    if (isServer()) return;

    // setStateUrl instead of setUrl to avoid creating a new entry in history
    // onPop is only triggered if window is defined, so this is fine:
    const handlePop = () => setStateUrl(parse(window.location.href));
    const handleClick = (e) => {
      // Attempt to find a valid "href", taking into account the exit conditions
      const href = getHref(e.target.closest("a"));
      if (!href) return false;

      // Found it, handle it with Crossroad properly
      e.preventDefault();
      const [path, hash] = href.split("#");

      // If it was found, handle it with Crossroad
      if (path) setUrl(path);
      if (hash) window.location.hash = "#" + hash;
    };

    window.addEventListener("popstate", handlePop);
    document.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("popstate", handlePop);
      document.removeEventListener("click", handleClick);
    };
    // This is not supposed to change, ever, but still a dependency so added it
    // here
  }, [setUrl]);

  return <Context.Provider value={[url, setUrl]}>{children}</Context.Provider>;
};
