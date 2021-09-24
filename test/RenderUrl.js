import React from "react";

import useUrl from "../src/hooks/useUrl.js";
import usePath from "../src/hooks/usePath.js";
import useQuery from "../src/hooks/useQuery.js";
import useHash from "../src/hooks/useHash.js";

export default function RenderUrl({ onClick, children }) {
  const [url] = useUrl();
  const [path] = usePath();
  const [query] = useQuery();
  const [hash] = useHash();
  return (
    <button
      data-url={JSON.stringify(url)}
      data-path={JSON.stringify(path)}
      data-query={JSON.stringify(query)}
      data-hash={JSON.stringify(hash)}
      onClick={onClick}
    ></button>
  );
}
