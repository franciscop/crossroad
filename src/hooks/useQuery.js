import { useCallback } from "react";

import { parse, stringify } from "../helpers/format.js";
import useUrl from "./useUrl.js";

const strQuery = (query) => stringify({ query });

const useQueryProp = (key) => {
  const [url, setUrl] = useUrl();
  const setValue = useCallback((value, opts) => {
    setUrl((url) => {
      const prev = url.query[key];
      value = typeof value === "function" ? value(prev) : value;
      // If it's the same as previously, do nothing
      if (value === prev) return url;

      // Remove any falsy property
      if (!value) {
        const { [key]: _, ...newQuery } = url.query;
        return { ...url, query: newQuery };
      } else {
        return { ...url, query: { ...url.query, [key]: value } };
      }
    }, opts);
  }, []);
  return [url.query[key], setValue];
};

const useQueryObject = () => {
  const [url, setUrl] = useUrl();
  const setQuery = useCallback((newQuery, opts) => {
    setUrl((url) => {
      // Accepts also function callbacks
      newQuery =
        typeof newQuery === "function" ? newQuery(url.query) : newQuery;

      // Parse a string to the proper object
      if (typeof newQuery === "string") {
        newQuery = parse("/?" + newQuery.replace(/^\?/, "")).query;
      }

      // Clean up by removing duplicates etc
      newQuery = parse(strQuery(newQuery)).query;

      // If it has not changed, just return the previous
      if (strQuery(newQuery) === strQuery(url.query)) return url;

      return { ...url, query: newQuery };
    }, opts);
  }, []);

  return [url.query, setQuery];
};

export default (key) => {
  if (key) {
    return useQueryProp(key);
  } else {
    return useQueryObject();
  }
};
