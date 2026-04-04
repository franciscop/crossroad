import React, { useEffect } from "react";

// TODO: make it work with the history as well
export default function Mock({ url, ...props }: { url: string; [key: string]: any }) {
  const oldUrl = window.location.href;
  window.history.pushState({}, "", url);

  useEffect(() => {
    return () => { window.history.pushState({}, "", oldUrl); };
  });
  return <div {...props} />;
}
