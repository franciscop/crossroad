const parse = base => {
  if (typeof base !== "string") return base;
  const url = {};
  const MyUrl = new URL(base, "https://example.com/");
  url.path = MyUrl.pathname.replace(/\/$/, "") || "/"; // It shouldn't end with /
  if (MyUrl.hash) {
    url.hash = MyUrl.hash?.replace(/^#/, "");
  }
  url.query = {};
  for (const [key, value] of MyUrl.searchParams) {
    url.query[key] = value;
  }
  return url;
};

const stringify = ({ path, query, hash } = {}) => {
  let str = path || "/";
  if (query && Object.keys(query).length) {
    str += "?";
    str += Object.entries(query)
      .map(([k, v]) => k + "=" + encodeURIComponent(v))
      .join("&");
  }
  if (hash) {
    str += "#" + hash;
  }
  return str;
};

export { parse, stringify };
export default { parse, stringify };
