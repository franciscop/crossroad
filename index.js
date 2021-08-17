import React, { createContext, useContext, useEffect, useState } from "react";

import samePath from "./src/samePath.js";
import RouterContext from "./src/Context.js";
import { parse, stringify } from "./src/format.js";
import { useUrl, usePath, useQuery, useHash } from "./src/hooks.js";

const Router = ({ children }) => {
  const [url, setUrl] = useState(parse(window.location.href));
  const setBrowserUrl = (url, opts = { mode: "push" }) => {
    if (typeof url === "string") {
      url = parse(url);
    }
    const href = stringify(url);
    if (opts.mode === "push") {
      history.pushState({}, null, href);
    } else if (opts.mode === "replace") {
      history.replaceState({}, null, href);
    } else {
      throw new Error(`Unrecognized mode ${opts.mode}`);
    }
    setUrl(url);
  };
  useEffect(() => {
    window.onpopstate = e => {
      setUrl(parse(window.location.href));
    };
    const handleClick = e => {
      const el = e.target.closest("a");
      if (!el) return;

      const href = el.getAttribute("href");
      if (!href) return;
      // Absolute paths should be ignored
      if (/^https?:\/\//.test(href)) return;

      // Open it either on a new or same tab, but always with a hard refresh
      if (el.getAttribute("target") !== null) return;

      // Handle it with Crossroad
      e.preventDefault();
      setBrowserUrl(href);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
  return (
    <RouterContext.Provider value={[url, setBrowserUrl]}>
      {children}
    </RouterContext.Provider>
  );
};

const Route = ({ path = "*", exact = true, component, render, children }) => {
  const [url, setUrl] = useUrl();
  const params = {};
  const matches = samePath(path, url, exact, params);
  if (!matches) return null;

  if (component) {
    const Comp = component;
    return <Comp {...params} />;
  } else if (render) {
    return render(params);
  } else if (children) {
    return children;
  } else {
    throw new Error("Route needs the prop `component`, `render` or `children`");
  }
};

const Switch = ({ children }) => {
  const [url] = useUrl();
  if (!children) return null;
  if (!Array.isArray(children)) children = [children];
  const bad = [...children].find(({ props }) => !props.path && !props.to);
  if (bad) {
    throw new Error(`<Switch> only accepts <Route> or <Redirect> as children`);
  }
  return children.find(({ props }) => samePath(props.path, url, props.exact));
};

export default Router;
export { Route, Switch, useUrl, usePath, useQuery, useHash, RouterContext };
