import { useContext } from "react";
import Context from "../Context.ts";
import type { Url, SetUrl } from "../types.ts";

export default (): [Url, SetUrl] => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error(`Wrap your App with <Router>`);
  return ctx;
};
