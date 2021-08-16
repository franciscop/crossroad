import { useContext } from "react";
import RouterContext from "./Context.js";

const useUrl = () => useContext(RouterContext);

const usePath = () => {
  const [url, setUrl] = useUrl();
  return [url.path, path => setUrl({ ...url, path })];
};

const useQuery = () => {
  const [url, setUrl] = useUrl();
  return [url.query, query => setUrl({ ...url, query })];
};

export { useUrl, usePath, useQuery };
