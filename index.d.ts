import React from "react";

// Helper type to parse parameter types from path string
type ParseParamType<T extends string> = T extends `${infer Name}<${infer Type}>`
  ? Type extends "number"
    ? { [K in Name]: number }
    : Type extends "string"
      ? { [K in Name]: string }
      : Type extends "date"
        ? { [K in Name]: Date }
        : Type extends "boolean"
          ? { [K in Name]: boolean }
          : { [K in Name]: string } // default to string
  : T extends `${infer Name}`
    ? { [K in Name]: string }
    : never;

// Extracts all params from path and combines them
type ExtractParams<T extends string> =
  T extends `${infer Prefix}/:${infer Param}/${infer Rest}`
    ? ParseParamType<Param> & ExtractParams<`/${Rest}`>
    : T extends `${infer Prefix}/:${infer Param}`
      ? ParseParamType<Param>
      : {};

// Main Route component with type inference
interface RouteProps<
  T extends Record<string, string | number | boolean | Date> = {},
> extends Omit<
    {
      path?: string;
      scrollUp?: boolean;
      component?: React.FunctionComponent<T>;
      render?: (params: T) => React.ReactNode;
      children?: React.ReactNode;
    },
    "component" | "render"
  > {
  path?: string;
}

// Infer params from path string literal
type InferParamsFromPath<T extends string> = T extends `${string}/:${string}`
  ? ExtractParams<T>
  : {};

// Modified Route declaration with path-based inference
declare const Route: <P extends string = string>(
  props: RouteProps<InferParamsFromPath<P>> & { path?: P } & (
      | {
          component: React.FunctionComponent<InferParamsFromPath<P>>;
          render?: never;
        }
      | {
          render: (params: InferParamsFromPath<P>) => React.ReactNode;
          component?: never;
        }
      | {}
    ),
) => React.ReactNode;

// Rest of your original declarations remain the same
type FC<T = {}> = React.FC<React.PropsWithChildren<T>>;
declare const Router: FC<{ scrollUp?: boolean; url?: string }>;
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
type Params = Record<string, string | number | boolean | Date>;
type Callable<T = string> = React.Dispatch<React.SetStateAction<T>>;
declare const Context: React.Context<[Url, Callable<UrlSet | string>]>;
declare function useUrl(): [Url, Callable<UrlSet | string>];
declare function usePath(): [string, Callable<string>];
declare function useQuery(): [Query, Callable<Query>];
declare function useQuery(key: string): [string, Callable<string>];
declare function useHash(): [string, Callable<string>];
declare function useParams<T = Params>(): T;
declare function useParams<T = string | number | boolean | Date>(
  key: string,
): T;

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
