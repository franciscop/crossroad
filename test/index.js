import "babel-polyfill";
import $ from 'react-test';

import Mock from "./Mock.js";
import RenderUrl from "./RenderUrl.js";
import withPath from "./withPath.js";

$.prototype.json = function(key) {
  return JSON.parse(
    this.find("button")
      .data(key || "url")
      .trim()
  );
};


export { Mock, RenderUrl, withPath };
export default { Mock, RenderUrl, withPath };
