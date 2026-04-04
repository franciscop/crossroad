import { createContext } from "react";
import type { Url, SetUrl } from "./types.ts";

export default createContext<[Url, SetUrl] | undefined>(undefined);
