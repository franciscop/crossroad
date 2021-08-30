import React, { createContext, useContext, useEffect, useState } from "react";

import samePath from "./samePath.js";
import Context from "./Context.js";
import { parse, stringify } from "./format.js";
import { useUrl, usePath, useQuery, useHash, useParams } from "./hooks.js";

const Router = ({ children }) => {
  const [url, setUrl] = useState(parse(window.location.href));
  const setBrowserUrl = (url, opts = { mode: "push" }) => {
    if (typeof url === "string") {
      url = parse(url);
    }
    const href = stringify(url);
    if (!["push", "replace"].includes(opts.mode)) {
      throw new Error(`Unrecognized mode "${opts.mode}"`);
    }
    if (opts.mode === "replace") {
      history.replaceState({}, null, href);
    } else {
      history.pushState({}, null, href);
    }
    setUrl(url);
  };
  useEffect(() => {
    window.onpopstate = e => setUrl(parse(window.location.href));
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
    <Context.Provider value={[url, setBrowserUrl]}>{children}</Context.Provider>
  );
};

const Route = ({ path = "*", exact = true, component, render, children }) => {
  const [url, setUrl] = useUrl();
  const params = {};
  const matches = samePath(path, url, params);
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

const Redirect = ({ path = "*", to }) => {
  const [url, setUrl] = useUrl();
  useEffect(() => {
    const matches = samePath(path, url);
    if (matches) setUrl(to);
  }, []);
  return null;
};

const toArray = children => {
  if (!children) return [];
  return Array.isArray(children) ? [...children] : [children];
};

// Same as with React-Router Switch  (https://github.com/remix-run/react-router/blob/main/packages/react-router/modules/Switch.js#L23-L26),
// we cannot use React.Children.toArray().find() because with that, a key is
// added so it remounts every time (even with the same component)
const Switch = ({ children }) => {
  const [url] = useUrl();
  const findMatch = child => samePath(child.props.path || "*", url);
  return toArray(children).find(findMatch) || null;
};

export default Router;
export {
  Route,
  Switch,
  Redirect,
  useUrl,
  usePath,
  useQuery,
  useHash,
  useParams,
  Context
};
