import React, { useCallback, useEffect, useRef, useState } from "react";

import Context from "./Context.js";
import { parse, stringify } from "./helpers/format.js";
import getHref from "./helpers/getHref.js";
import isServer from "./helpers/isServer.js";

export default ({ scrollUp, url: baseUrl, children }) => {
  const init = baseUrl || (isServer() ? "/" : window.location.href);
  const [url, setStateUrl] = useState(() => parse(init));

  // Track the latest URL in a ref so that history.pushState can be called
  // outside the setState updater, preventing React StrictMode from
  // double-firing it as a side effect of the double-invoked updater.
  const urlRef = useRef(url);

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

      // Add the entry to the current state, refresh whatever needs refreshing
      return parse(newUrl);
    });

    // Derive the next URL outside the updater so that history.pushState is
    // only called once. React StrictMode double-invokes state updaters in dev
    // to detect side effects; keeping pushState here avoids double navigation.
    const prev = urlRef.current;
    const resolved = typeof newUrl === "function" ? newUrl(prev) : newUrl;
    if (stringify(prev) !== stringify(resolved)) {
      const next = parse(resolved);
      urlRef.current = next;
      history[mode + "State"]({}, null, stringify(next));
      if (scrollUp) window.scrollTo(0, 0);
    }
  }, []);

  // Keep the ref in sync when state updates from sources other than setUrl
  // (e.g. popstate / direct setStateUrl calls)
  useEffect(() => {
    urlRef.current = url;
  }, [url]);

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

      if (path) {
        // Pass the full href so a path+hash link (e.g. /user#section) is
        // handled in a single history.pushState call instead of two separate
        // navigations (pushState for path + location.hash for hash).
        setUrl(href);
      } else if (hash) {
        // Hash-only link: scroll to anchor without adding a history entry
        window.location.hash = "#" + hash;
      }
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
