// Passing a possible element, returns the local href="abc" of it or null if
// it's not a good match
export default el => {
  if (!el) return null;

  const href = el.getAttribute("href");

  // Links without href should be ignored
  if (!href) return null;

  // Absolute paths should be ignored
  if (/^https?:\/\//.test(href)) return null;

  // Open it either on a new or same tab, but always with a hard refresh
  if (el.getAttribute("target") !== null) return null;

  return href;
};
