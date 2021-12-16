const single = (arr) => (arr.length > 1 ? arr : arr[0]);

const parse = (base) => {
  if (typeof base !== "string") return base;
  const url = {};
  const MyUrl = new URL(base, "http://localhost:3000/");
  url.path = MyUrl.pathname.replace(/\/$/, "") || "/"; // It shouldn't end with /
  url.query = {};
  for (const [key] of MyUrl.searchParams) {
    url.query[key] = single(MyUrl.searchParams.getAll(key));
  }
  if (MyUrl.hash) {
    url.hash = MyUrl.hash.replace(/^#/, "");
  }
  return url;
};

const stringify = (url) => {
  if (typeof url === "string") return url;
  const { path, query = {}, hash } = url || {};
  let str = path || "/";
  const params = new URLSearchParams(
    Object.entries(query)
      .filter(([key, val]) => val)
      .map(([key, val]) =>
        (Array.isArray(val) ? val : [val]).map((val) => [key, val])
      )
      .flat()
  ).toString();
  if (params) str += "?" + params;
  if (hash) str += "#" + hash;
  return str;
};

export { parse, stringify };
export default { parse, stringify };
