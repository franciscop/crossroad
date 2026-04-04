import "babel-polyfill";
import $ from 'react-test';

import Mock from "./Mock.tsx";
import RenderUrl from "./RenderUrl.tsx";
import withPath from "./withPath.tsx";

($ as any).prototype.json = function(key?: string) {
  return JSON.parse(
    this.find("button")
      .data(key || "url")
      .trim()
  );
};


export { Mock, RenderUrl, withPath };
export default { Mock, RenderUrl, withPath };
