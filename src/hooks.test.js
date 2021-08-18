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

  it("can use 'replace'", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [url, setUrl] = useUrl();
      const onClick = e =>
        setUrl("/user2?hello=world2#there2", { mode: "replace" });
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

  it("should use either 'replace' or 'push'", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [url, setUrl] = useUrl();
      const onClick = e =>
        setUrl("/user2?hello=world2#there2", { mode: "abc" });
      return <RenderUrl onClick={onClick} />;
    });
    expect($user.text()).toEqual("");
    try {
      await $user.find("button").click();
    } catch (error) {
      expect(error.message).toBe(`Unrecognized mode "abc"`);
    }
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

  it("can modify a single parameter", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery("hello");
      const onClick = e => setQuery("xxx");
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("query")).toEqual({ hello: "world" });
    await $user.find("button").click();
    expect($user.json("query")).toEqual({ hello: "xxx" });
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

  it("doesn't modify other parameters", async () => {
    const $user = withPath("/user?hello=world&a=b#there", () => {
      const [query, setQuery] = useQuery("hello");
      const onClick = e => setQuery("xxx");
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("query")).toEqual({ hello: "world", a: "b" });
    await $user.find("button").click();
    expect($user.json("query")).toEqual({ hello: "xxx", a: "b" });
  });
});

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
