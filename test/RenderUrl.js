import React from "react";
import { useUrl, usePath, useQuery, useHash } from "../src/hooks.js";

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
