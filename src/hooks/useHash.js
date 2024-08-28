import { useCallback } from "react";

import useUrl from "./useUrl.js";

export default () => {
  const [url, setUrl] = useUrl();
  const setHash = (hash, opts) => {
    setUrl((url) => {
      if (typeof hash === "function") hash = hash(url.hash);
      if (typeof hash !== "string") hash = "";
      hash = hash.replace(/^#/, "");
      return { ...url, hash };
    }, opts);
  };
  const setMemoHash = useCallback(setHash, []);
  return [url.hash, setMemoHash];
};
