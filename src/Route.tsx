import React from "react";

import Context from "./Context";
import samePath from "./helpers/samePath";
import useUrl from "./hooks/useUrl";
import type { Params } from "./types";

type ParseParamType<T extends string> = T extends `${infer Name}<${infer Type}>`
  ? Type extends "number"
    ? { [K in Name]: number }
    : Type extends "string"
      ? { [K in Name]: string }
      : Type extends "date"
        ? { [K in Name]: Date }
        : Type extends "boolean"
          ? { [K in Name]: boolean }
          : { [K in Name]: string }
  : { [K in T]: string };

type ExtractParams<T extends string> =
  T extends `${infer _Prefix}/:${infer Param}/${infer Rest}`
    ? ParseParamType<Param> & ExtractParams<`/${Rest}`>
    : T extends `${infer _Prefix}/:${infer Param}`
      ? ParseParamType<Param>
      : {};

type InferParamsFromPath<T extends string> = T extends `${string}/:${string}`
  ? ExtractParams<T>
  : {};

interface RoutePropsBase {
  path?: string;
  scrollUp?: boolean;
  children?: React.ReactNode;
}

type RouteProps<
  T extends Record<string, string | number | boolean | Date> = {},
> = RoutePropsBase &
  (
    | { component: React.FunctionComponent<T>; render?: never }
    | { render: (params: T) => React.ReactNode; component?: never }
    | { component?: never; render?: never }
  );

type RouteType = <P extends string = string>(
  props: RouteProps<InferParamsFromPath<P>> & { path?: P },
) => React.ReactNode;

const RouteImpl = ({
  path = "*",
  scrollUp,
  component,
  render,
  children,
}: RoutePropsBase & {
  component?: React.ComponentType<Params>;
  render?: (params: Params) => React.ReactNode;
}) => {
  // Check whether there's a parameter match or not
  const ctx = useUrl();
  const params = samePath(path, ctx[0]);
  if (!params) return null;

  if (scrollUp) {
    window.scrollTo(0, 0);
  }

  // Find the correct child to use
  if (component) {
    const Comp = component;
    children = <Comp {...params} />;
  } else if (render) {
    children = render(params);
  } else if (!children) {
    throw new Error("Route needs prop `component`, `render` or `children`");
  }

  // Wrap any children with the correct parameters
  return (
    <Context.Provider value={[{ ...ctx[0], params }, ctx[1]]}>
      {children}
    </Context.Provider>
  );
};

export default RouteImpl as unknown as RouteType;
