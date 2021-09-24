import React, { useEffect } from "react";
import $ from "react-test";

import { RenderUrl, withPath } from "../../test/index.js";
import usePath from "./usePath.js";

describe("usePath", () => {
  it("can parse the path", () => {
    const $user = withPath("/user?hello=world#there", RenderUrl);
    expect($user.json("path")).toEqual("/user");
  });

  it("can change the path", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [path, setPath] = usePath();
      const onClick = e => setPath("/user2");
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("path")).toEqual("/user");
    await $user.find("button").click();
    expect($user.json("path")).toEqual("/user2");
  });
});
