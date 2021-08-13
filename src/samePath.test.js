import samePath from "./samePath.js";

describe("samePath", () => {
  it("matches a perfect match", () => {
    expect(samePath("/", "/", true)).toBe(true);
  });

  it("matches a root param match", () => {
    const params = {};
    expect(samePath("/:id", "/abc", true, params)).toBe(true);
    expect(params).toEqual({ id: "abc" });
  });

  it("matches a subpath param match", () => {
    const params = {};
    expect(samePath("/users/:id", "/users/abc", true, params)).toBe(true);
    expect(params).toEqual({ id: "abc" });
  });

  it("matches a mixed param match", () => {
    const params = {};
    expect(samePath("/users/:id/def", "/users/abc/def", true, params)).toBe(
      true
    );
    expect(params).toEqual({ id: "abc" });
  });

  it("matches a root partial match", () => {
    expect(samePath("/", "/users", false)).toBe(true);
  });

  it("matches a mid partial match", () => {
    expect(samePath("/users/", "/users/abc", false)).toBe(true);
  });

  it("matches a partial match", () => {
    const params = {};
    expect(samePath("/users/:id", "/users/abc/def", false, params)).toBe(true);
    expect(params).toEqual({ id: "abc" });
  });
});
