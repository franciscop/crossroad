import { useContext } from "react";

import Context from "../Context.js";
import samePath from "../helpers/samePath";

export default ref => {
  const ctx = useContext(Context);

  // If there's no string, pass the last used one
  if (!ref) {
    return ctx[0].params;
  } else {
    return samePath(ref, ctx[0].path) || {};
  }
};
