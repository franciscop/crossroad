# Crossroad

A minimal routing library for React. It has mostly the same API as React Router, with three major differences ([and some smaller ones](#react-router-differences)):

- [TBD] It's just 3kb (min+gzip) instead of the 17kb with React Router(+Dom).
- The links are just `<a>` instead of custom links. Add a `target="_blank"` to open them in a new page, or `target="_self"` to do a full refresh in the current page.
- There are many more useful hooks like `useQuery`, `useHash`, etc.

If you already know React Router, that's basically all you should know to be productive right now:

```js
import React from "react";
import Router, { Switch, Route, Redirect } from "crossroad";

export default () => (
  <Router>
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/users/:id" component={Profile} />
      <Redirect to="/" />
    </Switch>
  </Router>
);
```

## API

```js
// Components
<Router>{...}</Router>
<Switch>{...}</Switch>
<Route />
<Redirect />

// Hooks
const [url, setUrl] = useUrl(); // The main one you normally need
// url.path, url.query, url.hash

const [query, setQuery] = useQuery();
const [path, setPath] = usePath();
const [hash, setHash] = useHash();
const [params, setParams] = useParams("/users/:id");
```

> NOTE: we don't have useHistory() nor useLocation(), utilize useUrl() instead

### useUrl()

Read and set the full URL (path+query+hash).

```js
export default function Login() {
  const [url, setUrl] = useUrl();

  const login = async () => {
    // ... do some stuff ...
    setUrl("/welcome");
  };

  return <Button onClick={login}>Login</Button>;
}
```

These are the structures of each:

- `url`: an object with the properties, it's similar to the native URL:
  - `url.href`: a string with the full URL
  - `url.path`: a string with the current pathname
  - `url.query`: an object with the keys and values. Example: `{ q: 'hello' }`, `{ q: 'hello', s: 'world' }`.
  - `url.hash`: the hashtag, without the "#"
- `setUrl()`: a setter in the React Hooks style
  - `setUrl("/newpath?search=hello")`: a shortcut with the string
  - `setUrl({ path: '/newpath' })`: set the path (and delete anything else)
  - `setUrl({ path: '/newpath', query: { hello: 'world' } })`: update the path and query
  - `setUrl(prev => ...)`: use the previous url (object)

The resulting `url` is an object containing each of the parts of the URL:

```js
// /whatever?filter=hello#world
const [url, setUrl] = useUrl();
console.log(url.path); // /whatever
console.log(url.query); // { filter: hello }
console.log(url.hash); // world
```

You can also set it fully or partially:

```js
const [url, setUrl] = useUrl();

setUrl("/#firsttime"); // [Shorthand] Redirect to home with a hashtag
setUrl({ path: "/", hash: "firsttime" }); // Same as above
setUrl({ ...url, path: "/" }); // Keep everything the same except the path
setUrl({ ...url, query: { search: myQuery } }); // Set a full search query
setUrl({ ...url, query: { ...url.query, safe: 0 } }); // Modify only one query param
```

`useUrl()` is powerful enough for all of your needs, but you might still be interested in other hooks to simplify situations where you do e.g. heavy query manipulation with `useQuery`.

### usePath()

Read and set the path(name) part of the URL:

```js
const Login = () => {
  const [path, setPath] = usePath();

  const login = async () => {
    // ...
    setPath("/welcome");
  };

  return <Button onClick={login}>Login</Button>;
};
```

> Note: this _only_ modifies the path(name) and keeps the search query and hash the same, so if you want to modify the full URL you should instead utilize `useUrl()` and `setUrl('/welcome')`

## React Router Differences

This part of the documentation tries to explain in detail the differences between Crossroad and React Router (Dom). Crossroad goal is to build a modern Router API from scratch, removing the legacy code and using Hooks natively.

For example with React Router your component receives the props `match`, `history`, etc. This is no longer needed in Crossroad, since now these are available with simple hooks so instead we pass any params straight away for convenience:

```js
import Router, { Route } from "crossroad";

const User = ({ id }) => `Hello user ${id}`;

export default () => (
  <Router>
    <Route path="/users/:id" component={User} />
  </Router>
);
```

### Plain Links

To add a link in your application, you use the native `<a>` element as expected. Crossroad will intercept the click on <a> elements and open the appropriate page without refresh. Some examples:

A normal link without page refresh:

```js
// Crossroad

// Normal link
<a href="/">Hello</a>

// Open in same page with refresh
<a href="https://example.com/">Hello</a> // http(s): links open with refresh
<a href="/" target="_self">Hello</a>  // self to open with refresh

// Open in new page
<a href="/myfile.pdf" target="_blank">Hello</a>  // Traditional target blank
<a href="https://example.com/" target="_blank">Hello</a>
```

The same in React Router are like this, note the inconsistencies of some times using `<Link>` and some times using `<a>`

```js
// React Router

// Normal link
<Link to="/">Hello</Link>

// Open in same page with refresh
<a href="https://example.com/">Hello</Link>
<a href="/">Hello</Link>

// Open in new page
<a href="https://example.com/" target="_blank">Hello</Link>
<Link to="https://example.com/">Hello</Link>  // Broken
```

### Improved Hooks

I've seen in multiple codebases people end up creating a `useQuery()` hook wrapping `useLocation` and `useHistory` to work with query parameters. Fear no more, this and some other useful hooks are there already on Crossroad.

#### useQuery();

#### useHash();

#### useParams("/users/:id");

#### useUrl(); // Combination of all of the above

// url.path, url.pathname, url.query, url.hash
