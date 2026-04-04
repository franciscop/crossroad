import React, { useEffect, useState } from "react";
import $ from "react-test";

import { RenderUrl, withPath } from "../helpers";

import useQuery from "./useQuery";
import usePath from "./usePath";

describe("useQuery", () => {
  it("can read the query", () => {
    const $user = withPath("/user?hello=world#there", RenderUrl);
    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: "world" });
  });

  it("can read the encoded query", () => {
    const $user = withPath("/user?he%20lo=wo%20ld", RenderUrl);
    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ "he lo": "wo ld" });
  });

  it("can change the query", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery();
      const onClick = (e: any) => setQuery({ welcome: "there" });
      return <RenderUrl onClick={onClick} />;
    });

    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: "world" });
    await $user.find("button").click();
    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ welcome: "there" });
  });

  it("can change the query with a callback", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery();
      const onClick = (e: any) =>
        setQuery((prev) => ({ ...prev, welcome: "there" }));
      return <RenderUrl onClick={onClick} />;
    });

    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: "world" });
    await $user.find("button").click();
    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: "world", welcome: "there" });
  });

  it("can change the query with a string", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery();
      const onClick = (e: any) => setQuery("welcome=there");
      return <RenderUrl onClick={onClick} />;
    });

    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: "world" });
    await $user.find("button").click();
    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ welcome: "there" });
  });

  it("ignores a leading question mark", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery();
      const onClick = (e: any) => setQuery("?welcome=there");
      return <RenderUrl onClick={onClick} />;
    });

    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: "world" });
    await $user.find("button").click();
    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ welcome: "there" });
  });

  it("can append to the query", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery();
      const onClick = () => setQuery({ ...query, welcome: "there" });
      return <RenderUrl onClick={onClick} />;
    });

    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: "world" });
    await $user.find("button").click();
    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: "world", welcome: "there" });
  });

  it("can remove from the query", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery();
      const onClick = () =>
        setQuery({ ...query, hello: false as any, welcome: "there" });
      return <RenderUrl onClick={onClick} />;
    });

    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: "world" });
    await $user.find("button").click();
    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ welcome: "there" });
  });

  it("can modify a single parameter", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery("hello");
      const onClick = (e: any) => setQuery("xxx");
      return <RenderUrl onClick={onClick} />;
    });

    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: "world" });
    await $user.find("button").click();
    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: "xxx" });
  });

  it("can delete a single parameter", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery("hello");
      const onClick = (e: any) => setQuery(null as any);
      return <RenderUrl onClick={onClick} />;
    });

    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: "world" });
    await $user.find("button").click();
    expect(JSON.parse($user.find("button").data("query")!)).toEqual({});
  });

  it("can modify a single parameter with a callback", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery("hello");
      const onClick = (e: any) => setQuery((prev: any) => prev + "xxx");
      return <RenderUrl onClick={onClick} />;
    });

    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: "world" });
    await $user.find("button").click();
    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: "worldxxx" });
  });

  it("doesn't change anything else", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery();
      const onClick = (e: any) => setQuery({ welcome: "there" });
      return <RenderUrl onClick={onClick} />;
    });

    expect(JSON.parse($user.find("button").data("url")!)).toMatchObject({
      path: "/user",
      query: { hello: "world" },
      hash: "there",
    });
    await $user.find("button").click();
    expect(JSON.parse($user.find("button").data("url")!)).toMatchObject({
      path: "/user",
      query: { welcome: "there" },
      hash: "there",
    });
  });

  it("doesn't change anything else when appending to the query", async () => {
    const $user = withPath("/user?hello=world#there", () => {
      const [query, setQuery] = useQuery();
      const onClick = (e: any) => setQuery({ ...query, welcome: "there" });
      return <RenderUrl onClick={onClick} />;
    });

    expect(JSON.parse($user.find("button").data("url")!)).toMatchObject({
      path: "/user",
      query: { hello: "world" },
      hash: "there",
    });
    await $user.find("button").click();
    expect(JSON.parse($user.find("button").data("url")!)).toMatchObject({
      path: "/user",
      query: { hello: "world", welcome: "there" },
      hash: "there",
    });
  });

  it("doesn't modify other parameters", async () => {
    const $user = withPath("/user?hello=world&a=b#there", () => {
      const [query, setQuery] = useQuery("hello");
      const onClick = (e: any) => setQuery("xxx");
      return <RenderUrl onClick={onClick} />;
    });

    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: "world", a: "b" });
    await $user.find("button").click();
    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: "xxx", a: "b" });
  });

  it("decodes the parameters", async () => {
    const $user = withPath("/?say=a+b%20c%2Bd%26e%2525", () => {
      const [query, setQuery] = useQuery("hello");
      const onClick = (e: any) => setQuery("xxx");
      return <RenderUrl onClick={onClick} />;
    });

    expect(JSON.parse($user.find("button").data("query")!)).toEqual({ say: "a b c+d&e%25" });
  });

  it("is stable with the setter and self", async () => {
    let calledValue = 0;
    let calledSetter = 0;
    const $user = withPath("/?hello=world", () => {
      const [query, setQuery] = useQuery();
      useEffect(() => {
        calledValue++;
      }, [query]);
      useEffect(() => {
        calledSetter++;
      }, [setQuery]);
      const onClick = (e: any) => setQuery({ hello: "there" });
      return <RenderUrl onClick={onClick} />;
    });

    expect(calledValue).toBe(1);
    expect(calledSetter).toBe(1);
    await $user.find("button").click();
    expect(calledValue).toBe(2);
    expect(calledSetter).toBe(1);
  });

  it("is stable with the setter and self for keyed queries", async () => {
    let calledValue = 0;
    let calledSetter = 0;
    const $user = withPath("/?hello=world", () => {
      const [query, setQuery] = useQuery("hello");
      useEffect(() => {
        calledValue++;
      }, [query]);
      useEffect(() => {
        calledSetter++;
      }, [setQuery]);
      const onClick = (e: any) => setQuery("there");
      return <RenderUrl onClick={onClick} />;
    });

    expect(calledValue).toBe(1);
    expect(calledSetter).toBe(1);
    await $user.find("button").click();
    expect(calledValue).toBe(2);
    expect(calledSetter).toBe(1);
  });

  it("is stable with the setter and others", async () => {
    let calledValue = 0;
    let calledSetter = 0;
    const $user = withPath("/?hello=world", () => {
      const [query, setQuery] = useQuery();
      const [path, setPath] = usePath();
      useEffect(() => {
        calledValue++;
      }, [query]);
      useEffect(() => {
        calledSetter++;
      }, [setQuery]);
      const onClick = (e: any) => setPath("greeting");
      return <RenderUrl onClick={onClick} />;
    });

    expect(calledValue).toBe(1);
    expect(calledSetter).toBe(1);
    await $user.find("button").click();
    expect(calledValue).toBe(1);
    expect(calledSetter).toBe(1);
  });

  it("is stable with the keyed setter and others", async () => {
    let calledValue = 0;
    let calledSetter = 0;
    const $user = withPath("/?hello=world", () => {
      const [query, setQuery] = useQuery("hello");
      const [path, setPath] = usePath();
      useEffect(() => {
        calledValue++;
      }, [query]);
      useEffect(() => {
        calledSetter++;
      }, [setQuery]);
      const onClick = (e: any) => setPath("greeting");
      return <RenderUrl onClick={onClick} />;
    });

    expect(calledValue).toBe(1);
    expect(calledSetter).toBe(1);
    await $user.find("button").click();
    expect(calledValue).toBe(1);
    expect(calledSetter).toBe(1);
  });

  it("is doesn't trigger unnecessary rerenders", async () => {
    let renders = 0;
    const $user = withPath("/?hello=world", () => {
      const [query, setQuery] = useQuery();
      useEffect(() => {
        renders++;
      });
      const onClick = (e: any) => setQuery({ hello: "world" });
      return <RenderUrl onClick={onClick} />;
    });

    expect(renders).toBe(1);
    await $user.find("button").click();
    expect(renders).toBe(1);
  });

  it("is doesn't trigger unnecessary rerenders on keys", async () => {
    let renders = 0;
    const $user = withPath("/?hello=world", () => {
      const [query, setQuery] = useQuery("hello");
      renders++;
      const onClick = (e: any) => setQuery("world");
      return <RenderUrl onClick={onClick} />;
    });

    expect(renders).toBe(1);
    await $user.find("button").click();
    expect(renders).toBe(1);
  });

  it("is memoized properly", async () => {
    let mounts = 0;
    let renders = 0;
    const $user = withPath("/?hello=world", () => {
      const [query, setQuery] = useQuery();
      const [, forceUpdate] = useState({});
      mounts++;
      useEffect(() => {
        renders++;
      }, [query, setQuery]);
      const onClick = (e: any) => forceUpdate({});
      return <RenderUrl onClick={onClick} />;
    });

    expect(mounts).toBe(1);
    expect(renders).toBe(1);
    await $user.find("button").click();
    expect(mounts).toBe(2);
    expect(renders).toBe(1);
  });

  it("has the setter memoized even if the query changes", async () => {
    let mounts = 0;
    let renders = 0;
    let queries = 0;
    const $user = withPath("/?hello=world", () => {
      const [query, setQuery] = useQuery();
      mounts++;
      useEffect(() => {
        queries++;
      }, [query]);
      useEffect(() => {
        renders++;
      }, [setQuery]);
      const onClick = (e: any) => setQuery({ bye: "world" });
      return <RenderUrl onClick={onClick} />;
    });

    expect(mounts).toBe(1);
    expect(renders).toBe(1);
    expect(queries).toBe(1);
    await $user.find("button").click();
    expect(mounts).toBe(2);
    expect(queries).toBe(2);
    expect(renders).toBe(1);
  });

  it("is memoized with subqueries", async () => {
    let mounts = 0;
    let renders = 0;
    const $user = withPath("/?hello=world", () => {
      const [query, setQuery] = useQuery("hello");
      const [, forceUpdate] = useState({});
      mounts++;
      useEffect(() => {
        renders++;
      }, [query, setQuery]);
      const onClick = (e: any) => forceUpdate({});
      return <RenderUrl onClick={onClick} />;
    });

    expect(mounts).toBe(1);
    expect(renders).toBe(1);
    await $user.find("button").click();
    expect(mounts).toBe(2);
    expect(renders).toBe(1);
  });

  it("is memoized with subqueries even if other query changes", async () => {
    let mounts = 0;
    let renders = 0;
    const $user = withPath("/?hello=world", () => {
      const [query, setQuery] = useQuery("hello");
      const [bye, setBye] = useQuery("bye");
      const [, forceUpdate] = useState({});
      mounts++;
      useEffect(() => {
        renders++;
      }, [query, setQuery]);
      const onClick = (e: any) => setBye("world");
      return <RenderUrl onClick={onClick} />;
    });

    expect(mounts).toBe(1);
    expect(renders).toBe(1);
    await $user.find("button").click();
    expect(mounts).toBe(2);
    expect(renders).toBe(1);
  });

  it("has the setter memoized even if the query changes", async () => {
    let mounts = 0;
    let renders = 0;
    let queries = 0;
    const $user = withPath("/?hello=world", () => {
      const [query, setQuery] = useQuery("hello");
      mounts++;
      useEffect(() => {
        queries++;
      }, [query]);
      useEffect(() => {
        renders++;
      }, [setQuery]);
      const onClick = (e: any) => setQuery("moon");
      return <RenderUrl onClick={onClick} />;
    });

    expect(mounts).toBe(1);
    expect(renders).toBe(1);
    expect(queries).toBe(1);
    await $user.find("button").click();
    expect(mounts).toBe(2);
    expect(queries).toBe(2);
    expect(renders).toBe(1);
  });

  describe("multiple values", () => {
    it("can handle multiple values", () => {
      const $user = withPath("/user?hello=world&hello=there", RenderUrl);
      expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: ["world", "there"] });
    });

    it("can change a single value", async () => {
      const $user = withPath("/user?hello=world&hello=there", () => {
        const [query, setQuery] = useQuery();
        const onClick = (e: any) => setQuery({ hello: ["world", "bye"] });
        return <RenderUrl onClick={onClick} />;
      });

      expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: ["world", "there"] });
      await $user.find("button").click();
      expect(JSON.parse($user.find("button").data("query")!)).toEqual({ hello: ["world", "bye"] });
    });
  });

  describe("Quick fire tests", () => {
    const cases: Record<string, [any, any][]> = {
      "?": [
        [{}, {}],
        [false, {}],
        [{ hello: "" }, {}],
        [{ hello: false }, {}],
        [{ hello: undefined }, {}],
        [{ hello: "world" }, { hello: "world" }],
        [{ hello: ["world", "moon"] }, { hello: ["world", "moon"] }],
        [{ hello: ["world", false] }, { hello: "world" }],
        [{ hello: [false, "moon"] }, { hello: "moon" }],
        [{ hello: [false] }, {}],
        [{ hello: [false, undefined, null, 0, ""] }, {}],
        ["hello=world", { hello: "world" }],
        ["?hello=world", { hello: "world" }],
        ["?hello=world&hello=moon", { hello: ["world", "moon"] }],
        ["?hello=world&hello=false", { hello: ["world", "false"] }],
      ],
      "?hello=world": [
        [(prev: any) => prev, { hello: "world" }],
        [(prev: any) => ({ hello: "moon" }), { hello: "moon" }],
        [(prev: any) => ({ ...prev, hello: "moon" }), { hello: "moon" }],
        [(prev: any) => ({ ...prev, bye: "moon" }), { hello: "world", bye: "moon" }],
        [(prev: any) => ({}), {}],
        [(prev: any) => false, {}],
      ],
    };
    for (let base in cases) {
      for (let [callback, result] of cases[base]) {
        it(
          "works for " + base + " to give " + JSON.stringify(result),
          async () => {
            const $user = withPath(base, () => {
              const [query, setQuery] = useQuery();
              const onClick = () => setQuery(callback);
              return <RenderUrl onClick={onClick} />;
            });

            await $user.find("button").click();
            expect(JSON.parse($user.find("button").data("query")!)).toEqual(result);
          }
        );
      }
    }
  });
});
