import { useContext } from "react";
import Context from "../Context.js";

export default () => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error(`Wrap your App with <Router>`);
  return ctx;
};
