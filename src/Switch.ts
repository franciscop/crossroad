import { useEffect, ReactElement, ReactNode } from "react";

import { stringify } from "./helpers/format.ts";
import samePath from "./helpers/samePath.ts";
import useUrl from "./hooks/useUrl.ts";
import type { Url } from "./types.ts";

interface ChildWithProps {
  props: { path?: string };
}

const toArray = (children: ReactNode): ChildWithProps[] => {
  const arr = Array.isArray(children) ? children : [children];
  return arr.filter(
    (c): c is ChildWithProps => c != null && typeof c === "object" && "props" in c
  );
};

interface SwitchProps {
  redirect?: string | { path: string } | ((url: Url) => string);
  children?: ReactNode;
}

// Same as with React-Router Switch  (https://github.com/remix-run/react-router/blob/main/packages/react-router/modules/Switch.js#L23-L26),
// we cannot use React.Children.toArray().find() because with that, a key is
// added so it remounts every time (even with the same component)
export default ({ redirect, children }: SwitchProps): ReactElement | null => {
  const [url, setUrl] = useUrl();
  const findMatch = (child: ChildWithProps) => samePath(child.props.path || "*", url);
  const match = toArray(children).find(findMatch) || null;
  useEffect(() => {
    if (!redirect) return;
    if (match) return;
    const resolved = typeof redirect === "function" ? redirect(url) : redirect;
    setUrl(stringify(resolved));
  }, [redirect, match]);
  return match as ReactElement | null;
};
