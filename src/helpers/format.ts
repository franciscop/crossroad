import type { Query, Url, UrlSet } from "../types.ts";

const single = (arr: string[]): string | string[] => (arr.length > 1 ? arr : arr[0]);

export const parse = (base: string | Url | UrlSet): Url => {
  if (typeof base !== "string") return base as Url;
  const url: Partial<Url> & { query: Query } = { query: {} };
  const MyUrl = new URL(base, "http://localhost:3000/");
  url.path = (MyUrl.pathname.replace(/\/$/, "") || "/")
    .replaceAll("%3C", "<")
    .replaceAll("%3E", ">"); // It shouldn't end with /
  url.query = {};
  for (const [key] of MyUrl.searchParams) {
    url.query[key] = single(MyUrl.searchParams.getAll(key));
  }
  if (MyUrl.hash) {
    url.hash = MyUrl.hash.replace(/^#/, "");
  }
  return url as Url;
};

export const stringify = (url: string | Url | UrlSet | null | undefined): string => {
  if (typeof url === "string") return url;
  const { path, query = {}, hash } = url || {};
  let str = path || "/";
  const params = new URLSearchParams(
    (Object.entries(query)
      .map(([key, val]) =>
        (Array.isArray(val) ? val : [val]).map((val) => [key, val]),
      )
      .flat() as string[][])
      .filter(([key, val]) => val),
  ).toString();
  if (params) str += "?" + params;
  if (hash) str += "#" + hash;
  return str;
};
