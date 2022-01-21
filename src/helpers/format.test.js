import { parse, stringify } from "./format.js";

describe("format.parse()", () => {
  it("can parse a full url", () => {
    expect(parse("/welcome?hello=world#francisco")).toEqual({
      path: "/welcome",
      query: { hello: "world" },
      hash: "francisco",
    });
  });

  it("can parse the path", () => {
    expect(parse("/").path).toEqual("/");
    expect(parse("/hello").path).toEqual("/hello");
    expect(parse("/hello/world").path).toEqual("/hello/world");
  });

  it("can parse the query parameters", () => {
    expect(parse("/?a=b").query).toEqual({ a: "b" });
    expect(parse("/hello?a=b").query).toEqual({ a: "b" });
    expect(parse("/?a=b&c=d").query).toEqual({ a: "b", c: "d" });
  });

  it("can parse multiple query parameters", () => {
    expect(parse("/?a=b&a=c").query).toEqual({ a: ["b", "c"] });
  });

  it("can parse the hash", () => {
    expect(parse("/#").hash).toEqual(undefined);
    expect(parse("/#hello").hash).toEqual("hello");
    expect(parse("/#hello-world").hash).toEqual("hello-world");
  });
});

describe("format.stringify()", () => {
  it("can stringify the URL", () => {
    expect(stringify()).toBe("/");
    expect(stringify({ path: "/" })).toBe("/");
  });

  const queryStr = (query) => stringify({ query });
  it("works with the query", () => {
    expect(queryStr({ a: "b" })).toBe("/?a=b");
    expect(queryStr({ a: "b", c: "d" })).toBe("/?a=b&c=d");
    expect(queryStr({ a: "b", c: "d", e: "f" })).toBe("/?a=b&c=d&e=f");
  });

  it("can ignore null", () => {
    expect(queryStr({ a: null })).toBe("/");
    expect(queryStr({ a: null, c: "d" })).toBe("/?c=d");
    expect(queryStr({ a: null, c: "d", e: "f" })).toBe("/?c=d&e=f");
  });

  it("works with the query and array parameters", () => {
    expect(queryStr({ a: "b" })).toBe("/?a=b");
    expect(queryStr({ a: ["b", "c"] })).toBe("/?a=b&a=c");
    expect(queryStr({ a: ["b", "c"], d: "e" })).toBe("/?a=b&a=c&d=e");
    expect(queryStr({ a: ["b", "c", "d"] })).toBe("/?a=b&a=c&a=d");
    expect(queryStr({ a: ["b", false, null] })).toBe("/?a=b");
  });

  it("works with the hash", () => {
    expect(stringify({ hash: "hello" })).toBe("/#hello");
    expect(stringify({ hash: "hello-world" })).toBe("/#hello-world");
  });
});
