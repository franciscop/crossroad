import React, { useEffect } from "react";

// TODO: make it work with the history
export default function Mock({ path, children }) {
  const href = "http://localhost:3000" + path;
  const oldLocation = { value: window.location };
  delete global.window.location;
  Object.defineProperty(global.window, "location", {
    value: new URL(href),
    configurable: true
  });

  useEffect(() => {
    return () => Object.defineProperty(window, "location", oldLocation);
  });
  return <div>{children}</div>;
}
