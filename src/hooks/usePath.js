import useUrl from "./useUrl.js";

export default () => {
  const [url, setUrl] = useUrl();
  return [url.path, (path, opts) => setUrl({ ...url, path }, opts)];
};
