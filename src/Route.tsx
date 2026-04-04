import React from "react";

import Context from "./Context.ts";
import samePath from "./helpers/samePath.ts";
import useUrl from "./hooks/useUrl.ts";
import type { Params } from "./types.ts";

interface RouteProps {
  path?: string;
  scrollUp?: boolean;
  component?: React.ComponentType<Params>;
  render?: (params: Params) => React.ReactNode;
  children?: React.ReactNode;
}

export default ({ path = "*", scrollUp, component, render, children }: RouteProps) => {
  // Check whether there's a parameter match or not
  const ctx = useUrl();
  const params = samePath(path, ctx[0]);
  if (!params) return null;

  if (scrollUp) {
    window.scrollTo(0, 0);
  }

  // Find the correct child to use
  if (component) {
    const Comp = component;
    children = <Comp {...params} />;
  } else if (render) {
    children = render(params);
  } else if (!children) {
    throw new Error("Route needs prop `component`, `render` or `children`");
  }

  // Wrap any children with the correct parameters
  return (
    <Context.Provider value={[{ ...ctx[0], params }, ctx[1]]}>
      {children}
    </Context.Provider>
  );
};
