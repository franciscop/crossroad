import { useContext } from "react";

import Context from "../Context.js";
import samePath from "../helpers/samePath";

// We can pass manually a param key to use only that param
export default (key) => {
  const [{ params }] = useContext(Context);

  // If there's no string, pass the last used one
  if (!key) return params || {};

  return key in params ? params[key] : "";
};
