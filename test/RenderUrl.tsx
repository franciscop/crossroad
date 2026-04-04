import React from "react";

import useUrl from "../src/hooks/useUrl.ts";
import usePath from "../src/hooks/usePath.ts";
import useQuery from "../src/hooks/useQuery.ts";
import useHash from "../src/hooks/useHash.ts";

export default function RenderUrl({ onClick, children }: { onClick?: () => void; children?: React.ReactNode }) {
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
