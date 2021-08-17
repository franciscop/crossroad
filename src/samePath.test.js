import samePath from "./samePath.js";

describe("samePath", () => {
  it("matches a perfect match", () => {
    expect(samePath("/", { path: "/" })).toBe(true);
  });

  it("matches a root param match", () => {
    const params = {};
    expect(samePath("/:id", { path: "/abc" }, params)).toBe(true);
    expect(params).toEqual({ id: "abc" });
  });

  it("matches a subpath param match", () => {
    const params = {};
    expect(samePath("/users/:id", { path: "/users/abc" }, params)).toBe(true);
    expect(params).toEqual({ id: "abc" });
  });

  it("doesn't match even with sunmatch", () => {
    const params = {};
    expect(samePath("/users/:id", "/users/abc/def", params)).toBe(false);
    expect(params).toEqual({});
  });

  it("matches a mixed param match", () => {
    const params = {};
    expect(samePath("/users/:id/def", { path: "/users/abc/def" }, params)).toBe(
      true
    );
    expect(params).toEqual({ id: "abc" });
  });

  it("matches a root partial match", () => {
    expect(samePath("/*", { path: "/users" })).toBe(true);
  });

  it("matches a mid partial match", () => {
    expect(samePath("/users/*", { path: "/users/abc" })).toBe(true);
  });

  it("matches a partial match", () => {
    const params = {};
    expect(samePath("/users/:id/*", { path: "/users/abc/def" }, params)).toBe(
      true
    );
    expect(params).toEqual({ id: "abc" });
  });
});

describe("match the query", () => {
  it("matches just the key", () => {
    expect(samePath("/?abc", "/?abc=def&ghi=jkl")).toBe(true);
  });
  it("matches with the value", () => {
    expect(samePath("/?abc=def", "/?abc=def&ghi=jkl")).toBe(true);
  });
  it("avoids a key match", () => {
    expect(samePath("/?xxx", "/?abc=def&ghi=jkl")).toBe(false);
  });
  it("avoids a value match", () => {
    expect(samePath("/?abc=xxx", "/?abc=def&ghi=jkl")).toBe(false);
  });
  it("matches multiple keys", () => {
    expect(samePath("/?abc&ghi", "/?abc=def&ghi=jkl")).toBe(true);
  });
  it("matches multiple values", () => {
    expect(samePath("/?abc=def&ghi=jkl", "/?abc=def&ghi=jkl")).toBe(true);
  });
  it("skips on a key", () => {
    expect(samePath("/?abc&ghi", "/?abc=def&ghh=jkl")).toBe(false);
  });
  it("skips on a value", () => {
    expect(samePath("/?abc=def&ghi=jkl", "/?abc=def&ghi=jkk")).toBe(false);
  });
});
