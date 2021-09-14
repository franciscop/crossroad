import { useContext } from "react";
import Context from "./Context.js";
import samePath from "./samePath";

const useUrl = () => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error(`Wrap your App with <Router>`);
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

const useParams = ref => {
  const ctx = useContext(Context);
  const [path] = usePath();

  // If there's no string, pass the last used one
  if (!ref) {
    return ctx[0].params;
  } else {
    const params = {};
    samePath(ref, path, params);
    return params;
  }
};

export { useUrl, usePath, useQuery, useHash, useParams };
