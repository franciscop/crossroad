export type Query = Record<string, string | string[]>;

export type Url = {
  path: string;
  query: Query;
  hash?: string;
  params?: Params;
};

export type UrlSet = {
  path?: string;
  query?: Query;
  hash?: string;
};

export type Params = Record<string, string | number | boolean | Date>;

export type SetUrlOptions = { mode?: "push" | "replace" };

export type NewUrlValue = Url | UrlSet | string;

export type SetUrl = (
  newUrl: NewUrlValue | ((prev: Url) => NewUrlValue),
  opts?: SetUrlOptions
) => void;
