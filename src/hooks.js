import { useContext } from "react";
import RouterContext from "./Context.js";

const useUrl = () => {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error(`Hooks should be used as children of <Router>`);
  return ctx;
};

const usePath = () => {
  const [url, setUrl] = useUrl();
  return [url.path, path => setUrl({ ...url, path })];
};

const useQuery = () => {
  const [url, setUrl] = useUrl();
  return [url.query, query => setUrl({ ...url, query })];
};

const useHash = () => {
  const [url, setUrl] = useUrl();
  return [url.hash, hash => setUrl({ ...url, hash })];
};

export { useUrl, usePath, useQuery, useHash };
