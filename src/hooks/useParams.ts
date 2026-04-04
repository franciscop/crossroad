import { useContext } from "react";

import Context from "../Context";
import type { Params } from "../types";

// We can pass manually a param key to use only that param
function useParams(): Params;
function useParams<T = string | number | boolean | Date>(key: string): T;
function useParams(key?: string): Params | string | number | boolean | Date {
  const [{ params }] = useContext(Context) as [{ params: Params }, unknown];

  // If there's no string, pass the last used one
  if (!key) return params || {};

  return key in params ? params[key] : "";
}

export default useParams;
