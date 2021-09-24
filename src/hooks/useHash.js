import useUrl from "./useUrl.js";

export default () => {
  const [url, setUrl] = useUrl();
  return [url.hash, (hash, opts) => setUrl({ ...url, hash }, opts)];
};
