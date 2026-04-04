import { useCallback } from "react";

import useUrl from "./useUrl.ts";
import type { SetUrlOptions } from "../types.ts";

type HashUpdater = (hash: string | undefined) => string;
type SetHash = (hash: string | HashUpdater, opts?: SetUrlOptions) => void;

export default (): [string | undefined, SetHash] => {
  const [url, setUrl] = useUrl();
  const setHash: SetHash = (hash, opts) => {
    setUrl((url) => {
      const resolved = typeof hash === "function" ? hash(url.hash) : hash;
      const h = typeof resolved !== "string" ? "" : resolved.replace(/^#/, "");
      return { ...url, hash: h };
    }, opts);
  };
  const setMemoHash = useCallback(setHash, []);
  return [url.hash, setMemoHash];
};
