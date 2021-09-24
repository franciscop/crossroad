import React from "react";
import $ from "react-test";

import { RenderUrl, withPath } from "../../test/index.js";

import useHash from "./useHash.js";

describe("useHash", () => {
  it("can parse the hash", () => {
    const $user = withPath("/user?hello=world#there", RenderUrl);
    expect($user.json("hash")).toEqual("there");
  });

  it("can change the hash", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [hash, setHash] = useHash();
      const onClick = e => setHash("there2");
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("hash")).toEqual("there");
    await $user.find("button").click();
    expect($user.json("hash")).toEqual("there2");
  });
});
