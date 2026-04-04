import React, { useEffect } from "react";

// TODO: make it work with the history as well
export default function Mock({ url, ...props }: { url: string; [key: string]: any }) {
  const href = "http://localhost:3000" + url;
  const oldLocation = { value: window.location };
  delete (window as any).location;
  Object.defineProperty(window, "location", {
    value: new URL(href),
    configurable: true,
  });

  useEffect(() => {
    return () => { Object.defineProperty(window, "location", oldLocation); };
  });
  return <div {...props} />;
}
