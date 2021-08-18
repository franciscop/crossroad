import { useContext } from "react";
import Context from "./Context.js";

const useUrl = () => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error(`Hooks should be used as children of <Router>`);
  return ctx;
};

const usePath = () => {
  const [url, setUrl] = useUrl();
  return [url.path, (path, opts) => setUrl({ ...url, path }, opts)];
};

const useQuery = key => {
  const [url, setUrl] = useUrl();
  const query = url.query;
  const setQuery = (query, opts) => setUrl({ ...url, query }, opts);
  if (key) {
    return [
      query[key],
      (value, opts) => setQuery({ ...query, [key]: value }, opts)
    ];
  }
  return [query, setQuery];
};

const useHash = () => {
  const [url, setUrl] = useUrl();
  return [url.hash, (hash, opts) => setUrl({ ...url, hash }, opts)];
};

export { useUrl, usePath, useQuery, useHash };
