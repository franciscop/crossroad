import React, { useEffect, useState } from "react";

import Context from "./Context.js";
import { parse, stringify } from "./helpers/format.js";
import getHref from "./helpers/getHref.js";
import isServer from "./helpers/isServer.js";

export default ({ url: baseUrl, children }) => {
  const init = baseUrl || (isServer() ? "/" : window.location.href);
  const [url, setStateUrl] = useState(() => parse(init));
  const setUrl = (url, { mode = "push" } = {}) => {
    if (!history[mode + "State"]) throw new Error(`Invalid mode "${mode}"`);
    history[mode + "State"]({}, null, stringify(url));
    setStateUrl(parse(url));
  };
  useEffect(() => {
    // The server doesn't have any of these fancy handlers
    if (isServer()) return;

    // setStateUrl instead of setUrl to avoid creating a new entry in history
    // onPop is only triggered if window is defined, so this is fine:
    const handlePop = () => setStateUrl(parse(window.location.href));
    const handleClick = e => {
      // Attempt to find a valid "href", taking into account the exit conditions
      const href = getHref(e.target.closest("a"));

      // If it was found, handle it with Crossroad
      if (href) {
        e.preventDefault();
        setUrl(href);
      }
    };

    window.addEventListener("popstate", handlePop);
    document.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("popstate", handlePop);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return <Context.Provider value={[url, setUrl]}>{children}</Context.Provider>;
};
