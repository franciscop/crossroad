import React from "react";
import Mock from "./Mock.js";
import $ from "react-test";

import Router from "../src/index.js";

export default function withPath(url, Comp) {
  return $(
    <Mock url={url}>
      <Router>
        <Comp />
      </Router>
    </Mock>
  );
}
