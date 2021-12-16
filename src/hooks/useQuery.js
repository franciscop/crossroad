import useUrl from "./useUrl.js";

export default (key) => {
  const [url, setUrl] = useUrl();
  const query = url.query;
  const setQuery = (query, opts) => setUrl({ ...url, query }, opts);
  if (key) {
    return [
      query[key],
      (value, opts) => {
        if (value === null) {
          const { [key]: _, ...newQuery } = query;
          return setQuery(newQuery, opts);
        } else {
          return setQuery({ ...query, [key]: value }, opts);
        }
      },
    ];
  }
  return [query, setQuery];
};
