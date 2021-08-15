import React, { createContext, useContext, useState } from "react";
import samePath from "./src/samePath.js";
import { parse, stringify } from "./src/format.js";

const RouterContext = createContext([]);

const useUrl = () => useContext(RouterContext);

const usePath = () => {
  const [url, setUrl] = useUrl();
  return [url.path, path => setUrl({ ...url, path })];
};

const Router = ({ children }) => {
  const [url, setUrl] = useState(parse(window.location.href));
  const setBrowserUrl = url => {
    if (typeof url === "string") {
      url = parse(url);
    }
    const href = stringify(url);
    history.pushState({}, null, href);
    setUrl(url);
  };
  return (
    <RouterContext.Provider value={[url, setBrowserUrl]}>
      {children}
    </RouterContext.Provider>
  );
};

const Route = ({ path, exact = true, component: Comp }) => {
  const [url, setUrl] = useUrl();
  const params = {};
  const matches = samePath(path, url.path, exact, params);
  if (matches) return <Comp {...params} />;
  return null;
};

const Switch = ({ children }) => {
  const [path] = usePath();
  if (!children) return null;
  if (!Array.isArray(children)) children = [children];
  const bad = [...children].find(child => !(child?.type?.name === "Route"));
  if (bad) {
    throw new Error(
      `<Switch> only accepts <Route> or <Redirect> as children, received:\n${JSON.stringify(
        bad
      )}`
    );
  }
  return children.find(({ props }) => samePath(props.path, path, props.exact));
};

export default Router;
export { Route, Switch, useUrl, usePath, RouterContext };
