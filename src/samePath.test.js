import samePath from "./samePath.js";

describe("samePath", () => {
  it("matches a perfect match", () => {
    expect(samePath("/", { path: "/" }, true)).toBe(true);
  });

  it("matches a root param match", () => {
    const params = {};
    expect(samePath("/:id", { path: "/abc" }, true, params)).toBe(true);
    expect(params).toEqual({ id: "abc" });
  });

  it("matches a subpath param match", () => {
    const params = {};
    expect(samePath("/users/:id", { path: "/users/abc" }, true, params)).toBe(
      true
    );
    expect(params).toEqual({ id: "abc" });
  });

  it("matches a mixed param match", () => {
    const params = {};
    expect(
      samePath("/users/:id/def", { path: "/users/abc/def" }, true, params)
    ).toBe(true);
    expect(params).toEqual({ id: "abc" });
  });

  it("matches a root partial match", () => {
    expect(samePath("/", { path: "/users" }, false)).toBe(true);
  });

  it("matches a mid partial match", () => {
    expect(samePath("/users/", { path: "/users/abc" }, false)).toBe(true);
  });

  it("matches a partial match", () => {
    const params = {};
    expect(
      samePath("/users/:id", { path: "/users/abc/def" }, false, params)
    ).toBe(true);
    expect(params).toEqual({ id: "abc" });
  });
});
