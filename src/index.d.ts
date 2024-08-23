import React from "react";

type FC<T> = React.FC<React.PropsWithChildren<T>>;

declare const Router: FC<{ scrollUp?: boolean; url?: string }>;

declare const Route: <T = any>(props: {
  path?: string;
  scrollUp?: boolean;
  component?: React.FunctionComponent<T>;
  render?: (params: T) => React.ReactNode;
  children?: any;
}) => any;

declare const Switch: FC<{
  redirect?: string | { path: string } | (() => string);
}>;

type Query = {
  [key: string]: string;
};

type Url = URL & {
  path: string;
  query: Query;
  hash?: string;
};

type UrlSet = {
  path?: string;
  query?: Query;
  hash?: string;
};

declare const Context: React.Context<any>;

type Callable<T = string> = React.Dispatch<React.SetStateAction<T>>;

declare function useUrl(): [Url, Callable<UrlSet | string>];
declare function usePath(): [string, Callable<string>];
declare function useQuery(): [Query, Callable<Query>];
declare function useQuery(filter: string): [string, Callable<string>];
declare function useHash(): [string, Callable<string>];
declare function useParams(ref: string): any;

export default Router;
export {
  Route,
  Switch,
  useUrl,
  usePath,
  useQuery,
  useHash,
  useParams,
  Context,
};
