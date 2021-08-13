import React, { createContext, useContext } from "react";
import samePath from "./src/samePath.js";

export const RouterContext = createContext({});

const parseUrl = url => {
  const MyUrl = new URL(url);
  MyUrl.path = MyUrl.pathname;
  return MyUrl;
};

export const useUrl = () => {
  const { url } = useContext(RouterContext);
  return [url, () => {}];
};

const usePath = () => {
  const [url, setUrl] = useUrl();
  return [url.path, path => setUrl({ ...url, path })];
};

export default function Router({ children }) {
  const url = parseUrl(window.location.href);
  const history = {};
  return (
    <RouterContext.Provider value={{ url, history }}>
      {children}
    </RouterContext.Provider>
  );
}

export const Route = ({ path, exact = true, component: Comp }) => {
  const [url, setUrl] = useUrl();
  const params = {};
  const matches = samePath(path, url.pathname, exact, params);
  if (matches) return <Comp {...params} />;
  return null;
};

export const Switch = ({ children }) => {
  const [path] = usePath();
  if (!children) return null;
  if (!Array.isArray(children)) children = [children];
  if ([...children].some(child => !(child?.type?.name === "Route"))) {
    throw new Error("<Switch> only accepts <Route> or <Redirect> as children");
  }
  return children.find(({ props }) => samePath(props.path, path, props.exact));
};
