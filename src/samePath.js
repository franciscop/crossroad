export default function samePath(ref, path, exact, params = {}) {
  if (path.endsWith("/")) path = path.slice(0, -1);
  if (ref.endsWith("/")) ref = ref.slice(0, -1);

  if (!exact) {
    const length = ref.split("/").length;
    const parts = path.split("/").slice(0, length);
    path = parts.join("/");
  }
  if (!ref.includes(":")) return ref === path;

  // Different length, cannot be the same paths
  if (ref.split("/").length !== path.split("/").length) return false;

  return ref.split("/").every((ref, i) => {
    const part = path.split("/")[i];
    if (ref.startsWith(":")) {
      params[ref.slice(1)] = part;
      return true;
    }
    return part === ref;
  });
}
