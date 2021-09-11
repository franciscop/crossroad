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

const Router = ({ url: baseUrl, children }) => {
  const init = typeof window === "undefined" ? "/" : window.location.href;
  const [url, setUrl] = useState(parse(baseUrl || init));
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
    // onPop is only triggered if window is defined, so this is fine:
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
    if (typeof window !== "undefined") {
      window.addEventListener("popstate", handlePop);
    }
    if (typeof document !== "undefined") {
      document.addEventListener("click", handleClick);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("popstate", handlePop);
      }
      if (typeof document !== "undefined") {
        document.removeEventListener("click", handleClick);
      }
    };
  }, []);
  return (
    <Context.Provider value={[url, setBrowserUrl]}>{children}</Context.Provider>
  );
};

const Route = ({ path = "*", exact = true, component, render, children }) => {
  const ctx = useContext(Context);
  const [url, setUrl] = useUrl();
  const params = {};
  const matches = samePath(path, url, params);
  if (!matches) return null;

  const childrenContext = [{ ...ctx[0], params }, ctx[1]];
  if (component) {
    const Comp = component;
    return (
      <Context.Provider value={childrenContext}>
        <Comp {...params} />
      </Context.Provider>
    );
  } else if (render) {
    return (
      <Context.Provider value={childrenContext}>
        {render(params)}
      </Context.Provider>
    );
  } else if (children) {
    return (
      <Context.Provider value={childrenContext}>{children}</Context.Provider>
    );
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
    if (!redirect) return;
    if (match) return;
    if (typeof redirect === "function") redirect = redirect(url);
    setUrl(stringify(redirect));
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
