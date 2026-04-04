import { createContext } from "react";
import type { Url, SetUrl } from "./types";

export default createContext<[Url, SetUrl] | undefined>(undefined);
