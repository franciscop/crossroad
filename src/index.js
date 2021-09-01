import React, { createContext, useContext, useEffect, useState } from "react";

import samePath from "./samePath.js";
import Context from "./Context.js";
import { parse, stringify } from "./format.js";
import { useUrl, usePath, useQuery, useHash, useParams } from "./hooks.js";

const getHref = el => {
  if (!el) return null;

  const href = el.getAttribute("href");

  // Links without href should be ignored
  if (!href) return null;

  // Absolute paths should be ignored
  if (/^https?:\/\//.test(href)) return null;

  // Open it either on a new or same tab, but always with a hard refresh
  if (el.getAttribute("target") !== null) return null;

  return href;
};

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
    const handlePop = e => setUrl(parse(window.location.href));
    const handleClick = e => {
      // Attempt to find a valid "href", taking into account the exit conditions
      const href = getHref(e.target.closest("a"));

      // If it was found, handle it with Crossroad
      if (href) {
        e.preventDefault();
        setBrowserUrl(href);
      }
    };
    window.addEventListener("popstate", handlePop);
    document.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("popstate", handlePop);
      document.removeEventListener("click", handleClick);
    };
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

const toArray = children => {
  if (!children) return [];
  return Array.isArray(children) ? [...children] : [children];
};

// Same as with React-Router Switch  (https://github.com/remix-run/react-router/blob/main/packages/react-router/modules/Switch.js#L23-L26),
// we cannot use React.Children.toArray().find() because with that, a key is
// added so it remounts every time (even with the same component)
const Switch = ({ redirect, children }) => {
  const [url, setUrl] = useUrl();
  const findMatch = child => samePath(child.props.path || "*", url);
  const match = toArray(children).find(findMatch) || null;
  useEffect(() => {
    if (redirect && !match) setUrl(redirect);
  }, [redirect, Boolean(match)]);
  return match;
};

export default Router;
export {
  Route,
  Switch,
  useUrl,
  usePath,
  useQuery,
  useHash,
  useParams,
  Context
};
