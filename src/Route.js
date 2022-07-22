import React, { useContext, useEffect } from "react";

import Context from "./Context.js";
import samePath from "./helpers/samePath.js";

export default ({ path = "*", scrollUp, component, render, children }) => {
  // Check whether there's a parameter match or not
  const ctx = useContext(Context);
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
    <Context.Provider value={[{ ...ctx[0], params }, ...ctx.slice(1)]}>
      {children}
    </Context.Provider>
  );
};
