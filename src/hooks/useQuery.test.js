import React, { useEffect } from "react";
import $ from "react-test";

import { RenderUrl, withPath } from "../../test/index.js";

import useQuery from "./useQuery.js";

describe("useQuery", () => {
  it("can read the query", () => {
    const $user = withPath("/user?hello=world#there", RenderUrl);
    expect($user.json("query")).toEqual({ hello: "world" });
  });

  it("can change the query", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery();
      const onClick = (e) => setQuery({ welcome: "there" });
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("query")).toEqual({ hello: "world" });
    await $user.find("button").click();
    expect($user.json("query")).toEqual({ welcome: "there" });
  });

  it("can append to the query", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery();
      const onClick = (e) => setQuery({ ...query, welcome: "there" });
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("query")).toEqual({ hello: "world" });
    await $user.find("button").click();
    expect($user.json("query")).toEqual({ hello: "world", welcome: "there" });
  });

  it("can modify a single parameter", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery("hello");
      const onClick = (e) => setQuery("xxx");
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("query")).toEqual({ hello: "world" });
    await $user.find("button").click();
    expect($user.json("query")).toEqual({ hello: "xxx" });
  });

  it("can delete a single parameter", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery("hello");
      const onClick = (e) => setQuery(null);
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("query")).toEqual({ hello: "world" });
    await $user.find("button").click();
    expect($user.json("query")).toEqual({});
  });

  it("doesn't change anything else", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery();
      const onClick = (e) => setQuery({ welcome: "there" });
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json()).toMatchObject({
      path: "/user",
      query: { hello: "world" },
      hash: "there",
    });
    await $user.find("button").click();
    expect($user.json()).toMatchObject({
      path: "/user",
      query: { welcome: "there" },
      hash: "there",
    });
  });

  it("doesn't change anything else when appending to the query", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery();
      const onClick = (e) => setQuery({ ...query, welcome: "there" });
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json()).toMatchObject({
      path: "/user",
      query: { hello: "world" },
      hash: "there",
    });
    await $user.find("button").click();
    expect($user.json()).toMatchObject({
      path: "/user",
      query: { hello: "world", welcome: "there" },
      hash: "there",
    });
  });

  it("doesn't modify other parameters", async () => {
    const $user = withPath("/user?hello=world&a=b#there", () => {
      const [query, setQuery] = useQuery("hello");
      const onClick = (e) => setQuery("xxx");
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("query")).toEqual({ hello: "world", a: "b" });
    await $user.find("button").click();
    expect($user.json("query")).toEqual({ hello: "xxx", a: "b" });
  });

  it("decodes the parameters", async () => {
    const $user = withPath("/?say=a+b%20c%2Bd%26e%2525", () => {
      const [query, setQuery] = useQuery("hello");
      const onClick = (e) => setQuery("xxx");
      return <RenderUrl onClick={onClick} />;
    });

    expect($user.json("query")).toEqual({ say: "a b c+d&e%25" });
  });
});
