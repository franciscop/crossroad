import { useCallback } from "react";
import useUrl from "./useUrl.js";

export default () => {
  const [url, setUrl] = useUrl();
  const setPath = (path, opts) => {
    setUrl((url) => {
      if (typeof path === "function") path = path(url.path);
      if (typeof path !== "string") path = "/";
      return { ...url, path };
    }, opts);
  };
  const setMemoPath = useCallback(setPath, []);
  return [url.path, setMemoPath];
};
