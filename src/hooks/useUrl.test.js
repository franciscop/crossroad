import React, { useEffect } from "react";
import $ from "react-test";

import { RenderUrl, withPath } from "../../test/index.js";

import useUrl from "./useUrl.js";

describe("useUrl", () => {
  it("can parse the url", () => {
    const $user = withPath("/user?hello=world#there", RenderUrl);
    expect($user.json()).toEqual({
      path: "/user",
      query: { hello: "world" },
      hash: "there",
    });
  });

  it("requires to be wrapped in <Router />", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    try {
      const App = () => {
        const [url, setUrl] = useUrl();
        return <div>Hello</div>;
      };
      expect(() => {
        $(<App />);
      }).toThrow();
    } finally {
      console.error.mockRestore();
    }
  });

  it("can change the url", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [url, setUrl] = useUrl();
      const onClick = (e) => setUrl("/user2?hello=world2#there2");
      return <RenderUrl onClick={onClick} />;
    });
    expect($user.json()).toEqual({
      path: "/user",
      query: { hello: "world" },
      hash: "there",
    });
    await $user.find("button").click();
    expect($user.json()).toEqual({
      path: "/user2",
      query: { hello: "world2" },
      hash: "there2",
    });
  });

  it("can change the url with a callback", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [url, setUrl] = useUrl();
      const onClick = (e) => setUrl(() => "/user2?hello=world2#there2");
      return <RenderUrl onClick={onClick} />;
    });
    expect($user.json()).toEqual({
      path: "/user",
      query: { hello: "world" },
      hash: "there",
    });
    await $user.find("button").click();
    expect($user.json()).toEqual({
      path: "/user2",
      query: { hello: "world2" },
      hash: "there2",
    });
  });

  it("can use 'replace'", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [url, setUrl] = useUrl();
      const onClick = (e) =>
        setUrl("/user2?hello=world2#there2", { mode: "replace" });
      return <RenderUrl onClick={onClick} />;
    });
    expect($user.json()).toEqual({
      path: "/user",
      query: { hello: "world" },
      hash: "there",
    });
    await $user.find("button").click();
    expect($user.json()).toEqual({
      path: "/user2",
      query: { hello: "world2" },
      hash: "there2",
    });
  });

  it("is stable", async () => {
    let eff = 0;
    let out = 0;
    const $user = withPath("/a", () => {
      const [url, setUrl] = useUrl();
      out++;
      useEffect(() => {
        eff++;
      }, [setUrl]);
      const onClick = (e) => setUrl("/b");
      return <RenderUrl onClick={onClick} />;
    });

    await $user.find("button").click();
    expect(out).toBe(2);
    expect(eff).toBe(1);
  });

  // Cannot test right now with ReactTest@0.13
  it.skip("should use either 'replace' or 'push'", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [url, setUrl] = useUrl();
      const onClick = (e) =>
        setUrl("/user2?hello=world2#there2", { mode: "abc" });
      return <RenderUrl onClick={onClick} />;
    });
    expect($user.text()).toEqual("");
    try {
      await $user.find("button").click();
    } catch (error) {
      expect(error.message).toBe(`Invalid mode "abc"`);
    }
  });
});
