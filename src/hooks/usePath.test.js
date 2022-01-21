import React, { useEffect, useState } from "react";
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
      const onClick = () => setPath("/user2");
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("path")).toEqual("/user");
    await $user.find("button").click();
    expect($user.json("path")).toEqual("/user2");
  });

  it("can change the path with a callback", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [path, setPath] = usePath();
      const onClick = () => setPath((path) => path + "2");
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("path")).toEqual("/user");
    await $user.find("button").click();
    expect($user.json("path")).toEqual("/user2");
  });

  it("has a memoed callback", async () => {
    let count = 0;
    const $user = withPath("/hello", () => {
      const [path, setPath] = usePath();
      useEffect(() => {
        count++;
      }, [setPath]);
      const onClick = () => setPath((prev) => prev + "/world");
      return <RenderUrl onClick={onClick} />;
    });

    expect(count).toBe(1);
    await $user.find("button").click();
    expect(count).toBe(1);
    expect($user.json("path")).toEqual("/hello/world");
  });

  it("doesn't update if it's the same path", async () => {
    let count = 0;
    const $user = withPath("/hello", () => {
      const [path, setPath] = usePath();
      count++;
      const onClick = () => setPath("/hello");
      return <RenderUrl onClick={onClick} />;
    });

    expect(count).toBe(1);
    await $user.find("button").click();
    expect(count).toBe(1);
  });

  it("removes it if it's falsy", async () => {
    const $user = withPath("/hello", () => {
      const [path, setPath] = usePath();
      const onClick = () => setPath(null);
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("path")).toEqual("/hello");
    await $user.find("button").click();
    expect($user.json("path")).toEqual("/");
  });
});
