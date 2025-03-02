import React from "react";

type FC<T = {}> = React.FC<React.PropsWithChildren<T>>;

declare const Router: FC<{ scrollUp?: boolean; url?: string }>;

type RouteProps<T = Record<string, any>> = {
  path?: string;
  scrollUp?: boolean;
  component?: React.FunctionComponent<T>;
  render?: (params: T) => React.ReactNode;
  children?: React.ReactNode;
} & (
  | { component: React.FunctionComponent<T>; render?: never }
  | { render: (params: T) => React.ReactNode; component?: never }
  | {} // Allow both to be optional, but not both together.
);

declare const Route: <T = any>(props: RouteProps<T>) => React.ReactNode;

declare const Switch: FC<{
  redirect?: string | { path: string } | (() => string);
}>;

type Query = Record<string, string>;

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

type Params = Record<string, string>;

declare const Context: React.Context<[Url, Callable<UrlSet | string>]>;

type Callable<T = string> = React.Dispatch<React.SetStateAction<T>>;

declare function useUrl(): [Url, Callable<UrlSet | string>];
declare function usePath(): [string, Callable<string>];
declare function useQuery(): [Query, Callable<Query>];
declare function useQuery(key: string): [string, Callable<string>];
declare function useHash(): [string, Callable<string>];
declare function useParams(): Params;
declare function useParams<T extends keyof Params>(key: T): Params[T];

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
