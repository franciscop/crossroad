import React from "react";

import Router, {
  Route,
  Switch,
  useHash,
  useParams,
  usePath,
  useQuery,
  useUrl,
} from "../";

console.log(() => <Router />);
console.log(() => <Router url="/hello" />);
console.log(() => <Router url="/hello">Children</Router>);

console.log(() => <Switch></Switch>);
console.log(() => <Switch redirect="/here"></Switch>);

console.log(() => <Route path="/hello" />);
console.log(() => <Route path="/hello/:id" />);
// No types, just receive it
console.log(() => (
  <Route path="/hello/:id" component={() => <div>Hello</div>} />
));
console.log(() => (
  <Route path="/hello/:id" component={({ id }) => <div>Hello {id}</div>} />
));
console.log(() => <Route path="/hello/:id" render={() => <div>Hello</div>} />);
console.log(() => (
  <Route path="/hello/:id" render={({ id }) => <div>Hello {id}</div>} />
));
console.log(() => (
  <Route path="/hello/:id">
    <div>Hello</div>
  </Route>
));
// Specify the reception types
console.log(() => (
  <Route<{ id: string }> path="/hello/:id" component={() => <div>Hello</div>} />
));
console.log(() => (
  <Route<{ id: string }>
    path="/hello/:id"
    component={({ id }) => <div>Hello {id}</div>}
  />
));
console.log(() => (
  <Route<{ id: string }> path="/hello/:id" render={() => <div>Hello</div>} />
));
console.log(() => (
  <Route<{ id: string }>
    path="/hello/:id"
    render={({ id }) => <div>Hello {id}</div>}
  />
));

const [url, setUrl] = useUrl();
url.path.split("");
url.query["abc"].split("");
url.hash.split("");
setUrl("/hello");
setUrl({ path: "/abc" });

const [path, setPath] = usePath();
path.split("");
setPath("/hello");

const [query1, setQuery1] = useQuery();
const _query1: { [key: string]: string } = query1;
setQuery1({ abc: "new value" });
console.log(_query1);

const [query2, setQuery2] = useQuery("key");
const _query2: string = query2;
setQuery2("new value");
console.log(_query2);

const [hash, setHash] = useHash();
hash.split("");
setHash("hello");

const params = useParams();
console.log(params.key);

const key = useParams("key");
key.split("");
