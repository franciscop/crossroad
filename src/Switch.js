import { useEffect } from "react";

import { stringify } from "./helpers/format.js";
import samePath from "./helpers/samePath.js";
import useUrl from "./hooks/useUrl.js";

const toArray = children => {
  if (!Array.isArray(children)) children = [children];
  return children.filter(c => c && c.props);
};

// Same as with React-Router Switch  (https://github.com/remix-run/react-router/blob/main/packages/react-router/modules/Switch.js#L23-L26),
// we cannot use React.Children.toArray().find() because with that, a key is
// added so it remounts every time (even with the same component)
export default ({ redirect, children }) => {
  const [url, setUrl] = useUrl();
  const findMatch = child => samePath(child.props.path || "*", url);
  const match = toArray(children).find(findMatch) || null;
  useEffect(() => {
    if (!redirect) return;
    if (match) return;
    if (typeof redirect === "function") redirect = redirect(url);
    setUrl(stringify(redirect));
  }, [redirect, match]);
  return match;
};
