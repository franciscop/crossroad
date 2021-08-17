import React, { useEffect } from "react";
import $ from "react-test";

import { Mock, RenderUrl } from "../test/index.js";

import Router from "../index.js";
import { useUrl, usePath, useQuery, useHash } from "../src/hooks.js";

$.prototype.json = function(key) {
  return JSON.parse(
    this.find("button")
      .data(key || "url")
      .trim()
  );
};

const withPath = (url, Comp) => {
  return $(
    <Mock path={url}>
      <Router>
        <Comp />
      </Router>
    </Mock>
  );
};

describe("useUrl", () => {
  it("can parse the url", () => {
    const $user = withPath("/user?hello=world#there", RenderUrl);
    expect($user.json()).toEqual({
      path: "/user",
      query: { hello: "world" },
      hash: "there"
    });
  });

  it("can change the url", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [url, setUrl] = useUrl();
      const onClick = e => setUrl("/user2?hello=world2#there2");
      return <RenderUrl onClick={onClick} />;
    });
    expect($user.json()).toEqual({
      path: "/user",
      query: { hello: "world" },
      hash: "there"
    });
    await $user.find("button").click();
    expect($user.json()).toEqual({
      path: "/user2",
      query: { hello: "world2" },
      hash: "there2"
    });
  });
});

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

describe("useQuery", () => {
  it("can read the query", () => {
    const $user = withPath("/user?hello=world#there", RenderUrl);
    expect($user.json("query")).toEqual({ hello: "world" });
  });

  it("can change the query", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery();
      const onClick = e => setQuery({ welcome: "there" });
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("query")).toEqual({ hello: "world" });
    await $user.find("button").click();
    expect($user.json("query")).toEqual({ welcome: "there" });
  });

  it("can append to the query", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery();
      const onClick = e => setQuery({ ...query, welcome: "there" });
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("query")).toEqual({ hello: "world" });
    await $user.find("button").click();
    expect($user.json("query")).toEqual({ hello: "world", welcome: "there" });
  });

  it("doesn't change anything else", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery();
      const onClick = e => setQuery({ welcome: "there" });
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json()).toMatchObject({
      path: "/user",
      query: { hello: "world" },
      hash: "there"
    });
    await $user.find("button").click();
    expect($user.json()).toMatchObject({
      path: "/user",
      query: { welcome: "there" },
      hash: "there"
    });
  });

  it("doesn't change anything else when appending to the query", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery();
      const onClick = e => setQuery({ ...query, welcome: "there" });
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json()).toMatchObject({
      path: "/user",
      query: { hello: "world" },
      hash: "there"
    });
    await $user.find("button").click();
    expect($user.json()).toMatchObject({
      path: "/user",
      query: { hello: "world", welcome: "there" },
      hash: "there"
    });
  });
});
