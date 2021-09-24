import samePath from "./samePath.js";

describe("samePath", () => {
  it("matches a perfect match", () => {
    expect(samePath("/", { path: "/" })).toEqual({});
  });

  it("equals quick strings", () => {
    expect(samePath("/abc", { path: "/def" })).toEqual(false);
  });

  it("matches a root param match", () => {
    expect(samePath("/:id", { path: "/abc" })).toEqual({ id: "abc" });
  });

  it("matches a subpath param match", () => {
    expect(samePath("/users/:id", { path: "/users/abc" })).toEqual({
      id: "abc"
    });
  });

  it("doesn't match even with sunmatch", () => {
    expect(samePath("/users/:id", "/users/abc/def")).toBe(false);
  });

  it("matches a mixed param match", () => {
    expect(samePath("/users/:id/def", { path: "/users/abc/def" })).toEqual({
      id: "abc"
    });
  });

  it("matches a root partial match", () => {
    expect(samePath("/*", { path: "/users" })).toEqual({});
  });

  it("matches a mid partial match", () => {
    expect(samePath("/users/*", { path: "/users/abc" })).toEqual({});
  });

  it("matches a partial match", () => {
    expect(samePath("/users/:id/*", { path: "/users/abc/def" })).toEqual({
      id: "abc"
    });
  });
});

describe("match the query", () => {
  it("matches just the key", () => {
    expect(samePath("/?abc", "/?abc=def&ghi=jkl")).toEqual({});
  });
  it("matches with the value", () => {
    expect(samePath("/?abc=def", "/?abc=def&ghi=jkl")).toEqual({});
  });
  it("avoids a key match", () => {
    expect(samePath("/?xxx", "/?abc=def&ghi=jkl")).toBe(false);
  });
  it("avoids a value match", () => {
    expect(samePath("/?abc=xxx", "/?abc=def&ghi=jkl")).toBe(false);
  });
  it("matches multiple keys", () => {
    expect(samePath("/?abc&ghi", "/?abc=def&ghi=jkl")).toEqual({});
  });
  it("matches multiple values", () => {
    expect(samePath("/?abc=def&ghi=jkl", "/?abc=def&ghi=jkl")).toEqual({});
  });
  it("skips on a key", () => {
    expect(samePath("/?abc&ghi", "/?abc=def&ghh=jkl")).toBe(false);
  });
  it("skips on a value", () => {
    expect(samePath("/?abc=def&ghi=jkl", "/?abc=def&ghi=jkk")).toBe(false);
  });
});
