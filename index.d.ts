import * as React_2 from 'react';
import React__default from 'react';
import { ReactElement } from 'react';
import { ReactNode } from 'react';

export declare const Context: React_2.Context<[Url, SetUrl] | undefined>;

declare const _default$6: ({ scrollUp, url: baseUrl, children }: RouterProps) => React__default.JSX.Element;
export default _default$6;

declare type ExtractParams<T extends string> = T extends `${infer _Prefix}/:${infer Param}/${infer Rest}` ? ParseParamType<Param> & ExtractParams<`/${Rest}`> : T extends `${infer _Prefix}/:${infer Param}` ? ParseParamType<Param> : {};

declare type HashUpdater = (hash: string | undefined) => string;

declare type InferParamsFromPath<T extends string> = T extends `${string}/:${string}` ? ExtractParams<T> : {};

declare type NewUrlValue = Url | UrlSet | string;

declare type Params = Record<string, string | number | boolean | Date>;

declare type ParseParamType<T extends string> = T extends `${infer Name}<${infer Type}>` ? Type extends "number" ? {
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

declare type PathUpdater = (path: string) => string;

declare type Query = Record<string, string | string[]>;

declare type QueryUpdater = (query: Query) => Query | string;

declare type QueryValue = string | string[] | undefined;

export declare const Route: RouteType;

declare type RouteProps<T extends Record<string, string | number | boolean | Date> = {}> = RoutePropsBase & ({
    component: React__default.FunctionComponent<T>;
    render?: never;
} | {
    render: (params: T) => React__default.ReactNode;
    component?: never;
} | {
    component?: never;
    render?: never;
});

declare interface RoutePropsBase {
    path?: string;
    scrollUp?: boolean;
    children?: React__default.ReactNode;
}

declare interface RouterProps {
    scrollUp?: boolean;
    url?: string;
    children?: React__default.ReactNode;
}

declare type RouteType = <P extends string = string>(props: RouteProps<InferParamsFromPath<P>> & {
    path?: P;
}) => React__default.ReactNode;

declare type SetHash = (hash: string | HashUpdater, opts?: SetUrlOptions) => void;

declare type SetPath = (path: string | PathUpdater, opts?: SetUrlOptions) => void;

declare type SetQuery = (newQuery: Query | string | QueryUpdater, opts?: SetUrlOptions) => void;

declare type SetQueryProp = (value: string | ((prev: QueryValue) => string), opts?: SetUrlOptions) => void;

declare type SetUrl = (newUrl: NewUrlValue | ((prev: Url) => NewUrlValue), opts?: SetUrlOptions) => void;

declare type SetUrlOptions = {
    mode?: "push" | "replace";
};

export declare const Switch: ({ redirect, children }: SwitchProps) => ReactElement | null;

declare interface SwitchProps {
    redirect?: string | {
        path: string;
    } | ((url: Url) => string);
    children?: ReactNode;
}

declare type Url = {
    path: string;
    query: Query;
    hash?: string;
    params?: Params;
};

declare type UrlSet = {
    path?: string;
    query?: Query;
    hash?: string;
};

export declare const useHash: () => [string | undefined, SetHash];

export declare function useParams(): Params;

export declare function useParams<T = string | number | boolean | Date>(key: string): T;

export declare const usePath: () => [string, SetPath];

export declare function useQuery(key: string): [QueryValue, SetQueryProp];

export declare function useQuery(): [Query, SetQuery];

export declare const useUrl: () => [Url, SetUrl];

export { }
