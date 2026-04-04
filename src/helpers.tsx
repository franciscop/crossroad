import React, { useEffect } from "react";
import $ from "react-test";

import Router from "./index";
import useHash from "./hooks/useHash";
import usePath from "./hooks/usePath";
import useQuery from "./hooks/useQuery";
import useUrl from "./hooks/useUrl";

export function Mock({ url, ...props }: { url: string; [key: string]: any }) {
  const oldUrl = window.location.href;
  window.history.pushState({}, "", url);
  useEffect(() => {
    return () => {
      window.history.pushState({}, "", oldUrl);
    };
  });
  return <div {...props} />;
}

export function RenderUrl({
  onClick,
  children,
}: {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
}) {
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

export function withPath(url: string, Comp: React.ComponentType) {
  return $(
    <Mock url={url}>
      <Router>
        <Comp />
      </Router>
    </Mock>,
  );
}
