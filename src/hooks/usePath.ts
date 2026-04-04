import { useCallback } from "react";

import useUrl from "./useUrl";
import type { SetUrlOptions } from "../types";

type PathUpdater = (path: string) => string;
type SetPath = (path: string | PathUpdater, opts?: SetUrlOptions) => void;

export default (): [string, SetPath] => {
  const [url, setUrl] = useUrl();
  const setPath: SetPath = (path, opts) => {
    setUrl((url) => {
      const p = typeof path === "function" ? path(url.path) : path;
      return { ...url, path: typeof p === "string" ? p : "/" };
    }, opts);
  };
  const setMemoPath = useCallback(setPath, []);
  return [url.path, setMemoPath];
};
