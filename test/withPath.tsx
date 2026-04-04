import React from "react";
import Mock from "./Mock.tsx";
import $ from "react-test";

import Router from "../src/index.ts";

export default function withPath(url: string, Comp: React.ComponentType) {
  return $(
    <Mock url={url}>
      <Router>
        <Comp />
      </Router>
    </Mock>
  );
}
