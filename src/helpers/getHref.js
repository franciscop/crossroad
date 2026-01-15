// Passing a possible element, returns the local href="abc" of it or null if
// it's not a good match
export default el => {
  if (!el) return null;

  const href = el.getAttribute("href");

  // Links without href should be ignored
  if (!href) return null;

  // Remove leading/trailing whitespace for proper matching
  const trimmed_href = href.trim();

  // Exclude any href starting with a protocol
  // This covers: http:, https:, tel:, mailto:, ftp:, file:, data:, javascript:, etc.
  if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:/.test(trimmed_href)) return null;

  // Open it either on a new or same tab, but always with a hard refresh
  if (el.getAttribute("target") !== null) return null;

  return trimmed_href;
};
