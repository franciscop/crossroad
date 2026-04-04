import * as React from 'react';
import React__default, { ReactNode, ReactElement } from 'react';

interface RouterProps {
    scrollUp?: boolean;
    url?: string;
    children?: React__default.ReactNode;
}
declare const _default$6: ({ scrollUp, url: baseUrl, children }: RouterProps) => React__default.JSX.Element;

type ParseParamType<T extends string> = T extends `${infer Name}<${infer Type}>` ? Type extends "number" ? {
    [K in Name]: number;
} : Type extends "string" ? {
    [K in Name]: string;
} : Type extends "date" ? {
    [K in Name]: Date;
} : Type extends "boolean" ? {
    [K in Name]: boolean;
} : {
    [K in Name]: string;
} : {
    [K in T]: string;
};
type ExtractParams<T extends string> = T extends `${infer _Prefix}/:${infer Param}/${infer Rest}` ? ParseParamType<Param> & ExtractParams<`/${Rest}`> : T extends `${infer _Prefix}/:${infer Param}` ? ParseParamType<Param> : {};
type InferParamsFromPath<T extends string> = T extends `${string}/:${string}` ? ExtractParams<T> : {};
interface RoutePropsBase {
    path?: string;
    scrollUp?: boolean;
    children?: React__default.ReactNode;
}
type RouteProps<T extends Record<string, string | number | boolean | Date> = {}> = RoutePropsBase & ({
    component: React__default.FunctionComponent<T>;
    render?: never;
} | {
    render: (params: T) => React__default.ReactNode;
    component?: never;
} | {
    component?: never;
    render?: never;
});
type RouteType = <P extends string = string>(props: RouteProps<InferParamsFromPath<P>> & {
    path?: P;
}) => React__default.ReactNode;
declare const _default$5: RouteType;

type Query = Record<string, string | string[]>;
type Url = {
    path: string;
    query: Query;
    hash?: string;
    params?: Params;
};
type UrlSet = {
    path?: string;
    query?: Query;
    hash?: string;
};
type Params = Record<string, string | number | boolean | Date>;
type SetUrlOptions = {
    mode?: "push" | "replace";
};
type NewUrlValue = Url | UrlSet | string;
type SetUrl = (newUrl: NewUrlValue | ((prev: Url) => NewUrlValue), opts?: SetUrlOptions) => void;

interface SwitchProps {
    redirect?: string | {
        path: string;
    } | ((url: Url) => string);
    children?: ReactNode;
}
declare const _default$4: ({ redirect, children }: SwitchProps) => ReactElement | null;

declare const _default$3: React.Context<[Url, SetUrl] | undefined>;

declare const _default$2: () => [Url, SetUrl];

type PathUpdater = (path: string) => string;
type SetPath = (path: string | PathUpdater, opts?: SetUrlOptions) => void;
declare const _default$1: () => [string, SetPath];

type QueryValue = string | string[] | undefined;
type SetQueryProp = (value: string | ((prev: QueryValue) => string), opts?: SetUrlOptions) => void;
type QueryUpdater = (query: Query) => Query | string;
type SetQuery = (newQuery: Query | string | QueryUpdater, opts?: SetUrlOptions) => void;
declare function useQuery(key: string): [QueryValue, SetQueryProp];
declare function useQuery(): [Query, SetQuery];

type HashUpdater = (hash: string | undefined) => string;
type SetHash = (hash: string | HashUpdater, opts?: SetUrlOptions) => void;
declare const _default: () => [string | undefined, SetHash];

declare function useParams(): Params;
declare function useParams<T = string | number | boolean | Date>(key: string): T;

export { _default$3 as Context, _default$5 as Route, _default$4 as Switch, _default$6 as default, _default as useHash, useParams, _default$1 as usePath, useQuery, _default$2 as useUrl };
