import { parse } from "./format.js";

// ref - the path as typed by the user
// url - the current url
export default function samePath(ref, url, params = {}) {
  // Clone them, to be able to mutate them within this function
  ref = JSON.parse(JSON.stringify(parse(ref)));
  url = JSON.parse(JSON.stringify(parse(url)));

  if (url.path.endsWith("/")) url.path = url.path.slice(0, -1) || "/";
  if (ref.path.endsWith("/")) ref.path = ref.path.slice(0, -1) || "/";

  // Extract whether it's exact or not
  if (ref.path.endsWith("*")) {
    // Remove "/*" or "*" in the end, making sure the minimum is "/"
    ref.path = ref.path.replace(/\/?\*/, "") || "/";

    const length = ref.path
      .slice(1)
      .split("/")
      .filter(Boolean).length;
    url.path =
      "/" +
      url.path
        .slice(1)
        .split("/")
        .slice(0, length)
        .join("/");
  }

  // Query matching
  if (Object.entries(ref.query).length) {
    for (let key in ref.query) {
      if (!(key in url.query)) return false;
      if (ref.query[key] && ref.query[key] !== url.query[key]) return false;
    }
  }

  // If the paths are exactly the same, then return true
  if (url.path === ref.path) return true;

  // Straightforward comparison between paths when there are no parameters
  if (!ref.path.includes(":")) return ref.path === url.path;

  // Different length, cannot be the same paths
  if (ref.path.split("/").length !== url.path.split("/").length) return false;

  // Make a comparison per-parameter; and exctract those parameters
  const extra = {};
  const match = ref.path.split("/").every((ref, i) => {
    const part = url.path.split("/")[i];
    if (ref.startsWith(":")) {
      extra[ref.slice(1)] = part;
      return true; // A parameter is always a match
    }
    return part === ref;
  });
  // Extend it only if there's a full match
  if (match) Object.assign(params, extra);
  return match;
}
