import { parse } from "./format";
import type { Url, UrlSet, Params } from "../types";

// ref - the path as typed by the user
// url - the current url
export default function samePath(
  ref: string | Url | UrlSet,
  url: string | Url | UrlSet,
  params: Params = {}
): Params | false {
  // Clone them, to be able to mutate them within this function
  let refParsed: Url = JSON.parse(JSON.stringify(parse(ref)));
  let urlParsed: Url = JSON.parse(JSON.stringify(parse(url)));

  urlParsed.path = urlParsed.path.replace(/\/$/, "") || "/";
  refParsed.path = refParsed.path.replace(/\/$/, "") || "/";

  // Extract whether it's exact or not
  if (refParsed.path.endsWith("*")) {
    // Remove "/*" or "*" in the end, making sure the minimum is "/"
    refParsed.path = refParsed.path.replace(/\/?\*/, "") || "/";

    const length = refParsed.path.split("/").filter(Boolean).length;
    urlParsed.path = "/" + urlParsed.path.slice(1).split("/").slice(0, length).join("/");
  }

  // Query matching
  if (Object.entries(refParsed.query).length) {
    for (const key in refParsed.query) {
      if (!(key in urlParsed.query)) return false;
      if (refParsed.query[key] && refParsed.query[key] !== urlParsed.query[key]) return false;
    }
  }

  // Straightforward comparison between paths when there are no parameters
  if (!refParsed.path.includes(":")) return refParsed.path === urlParsed.path && params;

  // Different length, cannot be the same paths
  if (refParsed.path.split("/").length !== urlParsed.path.split("/").length) return false;

  // Make a comparison per-parameter; and extract those parameters
  const extra: Params = {};
  const match = refParsed.path.split("/").every((refPart: string, i: number) => {
    const part = urlParsed.path.split("/")[i];
    if (refPart.startsWith(":")) {
      let key = refPart.slice(1);
      let type = "string";
      if (key.includes("<")) {
        [key, type] = key.split("<");
        type = type.slice(0, -1);
      }
      const value = decodeURIComponent(part);
      extra[key] =
        type === "number"
          ? Number(value)
          : type === "date"
            ? new Date(/^\d+$/.test(value) ? Number(value) : value)
            : type === "boolean"
              ? value === "true"
              : value;
      // console.log(key, value, extra);
      return params; // A parameter is always a match
    }
    return part === refPart;
  });
  // Extend it only if there's a full match
  if (match) Object.assign(params, extra);
  return match && params;
}
