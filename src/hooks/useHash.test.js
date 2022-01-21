import React, { useState, useEffect } from "react";
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
      const onClick = () => setHash("there2");
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("hash")).toEqual("there");
    await $user.find("button").click();
    expect($user.json("hash")).toEqual("there2");
  });

  it("can change the hash with a callback", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [hash, setHash] = useHash();
      const onClick = () => setHash((prev) => prev + "2");
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("hash")).toEqual("there");
    await $user.find("button").click();
    expect($user.json("hash")).toEqual("there2");
  });

  it("removes any extra leading hash", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [hash, setHash] = useHash();
      const onClick = () => setHash("#there2");
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("hash")).toEqual("there");
    await $user.find("button").click();
    expect($user.json("hash")).toEqual("there2");
  });

  it("has a memoed callback", async () => {
    let count = 0;
    const $user = withPath("/#hello", () => {
      const [hash, setHash] = useHash();
      useEffect(() => {
        count++;
      }, [setHash]);
      const onClick = () => setHash((prev) => prev + " world");
      return <RenderUrl onClick={onClick} />;
    });

    expect(count).toBe(1);
    await $user.find("button").click();
    expect(count).toBe(1);
    expect($user.json("hash")).toEqual("hello world");
  });

  it("doesn't update if it's the same hash", async () => {
    let count = 0;
    const $user = withPath("/#hello", () => {
      const [hash, setHash] = useHash();
      count++;
      const onClick = () => setHash("hello");
      return <RenderUrl onClick={onClick} />;
    });

    expect(count).toBe(1);
    await $user.find("button").click();
    expect(count).toBe(1);
  });

  it("removes it if it's falsy", async () => {
    const $user = withPath("/#hello", () => {
      const [hash, setHash] = useHash();
      const onClick = () => setHash(null);
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("hash")).toEqual("hello");
    await $user.find("button").click();
    expect($user.json("hash")).toEqual("");
  });
});
