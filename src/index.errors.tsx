import React from "react";

import Router, { Route, Switch, useHash, usePath, useQuery, useUrl } from "../";

// THROWS Type 'number' is not assignable to type 'string'
console.log(() => <Router url={3} />);

// THROWS Type 'number' is not assignable to type 'string | { path: string; } | (() => string) | undefined'.
console.log(() => <Switch redirect={3}></Switch>);

// THROWS Type 'number' is not assignable to type 'string'
console.log(() => <Route path={3} />);

const [url, setUrl] = useUrl();
// THROWS Type 'Url' is not assignable to type 'number'.
const _url: number = url;
console.log(_url);
// THROWS Argument of type 'number' is not assignable to parameter of type 'SetStateAction<string | UrlSet>'.
setUrl(3);

const [path, setPath] = usePath();
// THROWS Type 'string' is not assignable to type 'number'.
const _path: number = path;
console.log(_path);
// THROWS Argument of type 'number' is not assignable to parameter of type 'SetStateAction<string>'.
setPath(3);

const [query1, setQuery1] = useQuery();
// THROWS Type 'Query' is not assignable to type 'number'.
const _query1: number = query1;
console.log(_query1);
// THROWS Argument of type 'number' is not assignable to parameter of type 'SetStateAction<Query>'.
setQuery1(3);

const [query2, setQuery2] = useQuery("key");
// THROWS Type 'string' is not assignable to type 'number'.
const _query2: number = query2;
console.log(_query2);
// THROWS Argument of type 'number' is not assignable to parameter of type 'SetStateAction<string>'.
setQuery2(3);

const [hash, setHash] = useHash();
// THROWS Type 'string' is not assignable to type 'number'.
const _hash: number = hash;
console.log(_hash);
// THROWS Argument of type 'number' is not assignable to parameter of type 'SetStateAction<string>'.
setHash(3);
