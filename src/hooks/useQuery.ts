import { useCallback } from "react";

import { parse, stringify } from "../helpers/format";
import useUrl from "./useUrl";
import type { Query, SetUrlOptions } from "../types";

const strQuery = (query: Query): string => stringify({ query });

type QueryValue = string | string[] | undefined;
type SetQueryProp = (
  value: string | ((prev: QueryValue) => string),
  opts?: SetUrlOptions,
) => void;
type QueryUpdater = (query: Query) => Query | string;
type SetQuery = (
  newQuery: Query | string | QueryUpdater,
  opts?: SetUrlOptions,
) => void;

const useQueryProp = (key: string): [QueryValue, SetQueryProp] => {
  const [url, setUrl] = useUrl();
  const setValue = useCallback<SetQueryProp>((value, opts) => {
    setUrl((url) => {
      const prev = url.query[key];
      const resolved = typeof value === "function" ? value(prev) : value;
      // If it's the same as previously, do nothing
      if (resolved === prev) return url;

      // Remove any falsy property
      if (!resolved) {
        const { [key]: _, ...newQuery } = url.query;
        return { ...url, query: newQuery };
      } else {
        return { ...url, query: { ...url.query, [key]: resolved } };
      }
    }, opts);
  }, []);
  return [url.query[key], setValue];
};

const useQueryObject = (): [Query, SetQuery] => {
  const [url, setUrl] = useUrl();
  const setQuery = useCallback<SetQuery>((newQuery, opts) => {
    setUrl((url) => {
      // Accepts also function callbacks
      let q: Query | string =
        typeof newQuery === "function" ? newQuery(url.query) : newQuery;

      // Parse a string to the proper object
      if (typeof q === "string") {
        q = parse("/?" + q.replace(/^\?/, "")).query;
      }

      // Clean up by removing duplicates etc
      const cleanQ = parse(strQuery(q as Query)).query;

      // If it has not changed, just return the previous
      if (strQuery(cleanQ) === strQuery(url.query)) return url;

      return { ...url, query: cleanQ };
    }, opts);
  }, []);

  return [url.query, setQuery];
};

function useQuery(key: string): [QueryValue, SetQueryProp];
function useQuery(): [Query, SetQuery];
function useQuery(key?: string) {
  if (key) {
    return useQueryProp(key);
  } else {
    return useQueryObject();
  }
}

export default useQuery;
