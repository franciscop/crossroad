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

const isServer = () => typeof window === "undefined";

const Router = ({ url: baseUrl, children }) => {
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

    // onPop is only triggered if window is defined, so this is fine:
    const handlePop = () => setUrl(window.location.href);
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

const Route = ({ path = "*", exact = true, component, render, children }) => {
  // Check whether there's a parameter match or not
  const ctx = useContext(Context);
  const params = samePath(path, ctx[0]);
  if (!params) return null;

  // Find the correct child to use
  if (component) {
    const Comp = component;
    children = <Comp {...params} />;
  } else if (render) {
    children = render(params);
  } else if (!children) {
    throw new Error("Route needs prop `component`, `render` or `children`");
  }

  // Wrap any children with the correct parameters
  return (
    <Context.Provider value={[{ ...ctx[0], params }, ...ctx.slice(1)]}>
      {children}
    </Context.Provider>
  );
};

const toArray = children => {
  if (!Array.isArray(children)) children = [children];
  return children.filter(c => c && c.props);
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
  }, [redirect, match]);
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
