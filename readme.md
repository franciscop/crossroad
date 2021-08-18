# Crossroad [![npm install crossroad](https://img.shields.io/badge/npm%20install-crossroad-blue.svg "install badge")](https://www.npmjs.com/package/crossroad) [![test badge](https://github.com/franciscop/crossroad/workflows/tests/badge.svg "test badge")](https://github.com/franciscop/crossroad/blob/master/.github/workflows/tests.yml) [![gzip size](https://img.badgesize.io/franciscop/crossroad/master/index.min.js.svg?compression=gzip "gzip badge")](https://github.com/franciscop/crossroad/blob/master/index.min.js)

A routing library for React with a familiar interface. It has [some differences](#react-router-differences) with React Router so you write cleaner code:

- The links are plain `<a>` instead of custom components. [Read more](#a).
- There are useful hooks like [`useUrl`](#useurl), [`useQuery`](#usequery), etc.
- The `<Route>` path is `exact` by default and can match query parameters.
- It's [just 3kb](https://bundlephobia.com/package/crossroad) (min+gzip) instead of the 17kb of React Router(+Dom).

[**demo on CodeSandbox**](https://codesandbox.io/s/recursing-wozniak-uftyo?file=/src/App.js)

```js
// App.js
import Router, { Switch, Route, Redirect } from "crossroad";

export default () => (
  <Router>
    <nav>
      <a href="/">Home</a>
      <a href="/users">Users</a>
      ...
    </nav>
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/users" component={Users} />
      <Route path="/users/:id" component={Profile} />
      <Redirect to="/" />
    </Switch>
  </Router>
);
```

> NOTE: within Crossroad's and for lack of a better name, "URL" refers to the combination of path + search query + hash.

## Getting Started

Create a React project (`npx create-react-app demo`) and install Crossroad:

```js
npm i crossroad
```

Then import it on your App.js and define some routes:

```js
import Router, { Switch, Route } from "crossroad";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/users/:id" component={Profile} />
      </Switch>
    </Router>
  );
}
```

Then let's add some navigation and the actual pages:

```js
import Router, { Switch, Route } from "crossroad";

const Home = () => <main>Home Page</main>;
const Profile = ({ id }) => <main>Hello {id.toUpperCase()}</main>;

export default function App() {
  return (
    <Router>
      <nav>
        <a href="/">Home</a>
        <a href="/users/a">User A</a>
        <a href="/users/b">User B</a>
      </nav>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/users/:id" component={Profile} />
      </Switch>
    </Router>
  );
}
```

Now you can start your project and test it by visiting `http://localhost:3000/` and `http://localhost:3000/login`:

```bash
npm start
```

See the more complete working example [in this CodeSandbox](https://codesandbox.io/s/recursing-wozniak-uftyo?file=/src/App.js).

## API

The API is composed of these parts:

- [`<Router />`](#router): the top-level component that should wrap your whole app.
- [`<Switch />`](#switch): renders only the first child that matches the current url.
- [`<Route />`](#route): filters whether the given component should be rendered or not for the current URL.
- [`<Redirect />`](#redirect): takes the user to a different URL if it's rendered.
- [`<a />`](#a): a plain HTML link, use it to navigate between pages.
- [`useUrl()`](#useurl): a hook that returns the current URL and a setter to update it.
- [`usePath()`](#usepath): a hook that returns the current path and a setter to update it.
- [`useQuery()`](#usequery): a hook that returns the current query and a setter to update it.
- [`useHash()`](#usehash): a hook that returns the current hash and a setter to update it.
- [`useParams()`](#useparams): a hook that extracts params form the current path.

`Router` is the default export, `<a>` is not exported since it's just the plain link element, and everything else are named exports:

```js
import Router, { Switch, Route, Redirect, useUrl, usePath } from "crossroad";
```

### `<Router />`

The top-level component that has to wrap everything else. Internally it's used to handle clicks, history, etc. It's also the default export of the library:

```js
// App.js
import Router from "crossroad";

export default function App() {
  return <Router>... Your normal App code ...</Router>;
}
```

You would normally setup this Router straight on your App, along things like [Statux](https://statux.dev/)'s or [Redux](https://redux.js.org/)'s Store, error handling, translations, etc.

### `<Switch />`

A component that will only render the first of its children that matches the current URL. This is very useful to handle 404s, multiple routes matching, etc. For example, if you have a username system like `"/:username"` but want to have a help page, you can make it work easily with the switch:

```js
// In https://example.com/help, it'll render the Help component only
<Switch>
  <Route path="/help" component={Help} />
  <Route path="/:username" component={User} />
</Switch>
```

It is also very useful for 404s:

```js
<Switch>
  <Route path="/path1" component={Comp1} />
  <Route path="/path2" component={Comp2} />
  <Route component={NotFound} />
</Switch>
```

The `<Switch>` component only accepts `<Route>` or `<Redirect>` as its children.

### `<Route />`

This component defines a conditional path that, when strictly matched, renders the given component. Its props are:

- `path`: the path to match to the current browser's URL. It can have parameters `/:id` and a wildcard at the end `*` to make it a partial route.
- `component`: the component that will be rendered if the browser's URL matches the `path` parameter.
- `render`: a function that will be called with the params if the browser's URL matches the `path` parameter.
- `children`: the children to render if the browser's URL matches the `path` parameter.

So for example if the `path` prop is `"/user"` and you visit the page `"/user"`, then the component is rendered; it is ignored otherwise:

```js
// In https://example.com/
<Route path="/" component={Home} /> // Rendered
<Route path="/*" component={Any} />  // Rendered
<Route path="/user" component={User} />  // Not rendered
<Route path="/:page" component={Page} />  // Not rendered

// In https://example.com/user/
<Route path="/" component={Home} /> // Not Rendered
<Route path="/*" component={Any} />  // Rendered
<Route path="/user" component={User} />  // Rendered
<Route path="/:page" component={Page} />  // Rendered
```

When matching a path with a parameter (a part of the url that starts with `:`) it will be passed as a prop straight to the children:

```js
// In https://example.com/user/abc
const User = ({ id }) => <div>Hello {id}</div>;
const UserList = () => <div>List here</div>;

<Route path="/user/:id" component={User} />;
// <div>Hello abc</div>

<Route path="/user/:id" render={({ id }) => <User id={id} />} />;
// <div>Hello abc</div>

// Avoid when you need the params, since they cannot be passed
<Route path="/user/">
  <UserList />
</Route>;
// <div>List here</div>
```

> NOTE: the parameter is passed straight to the component instead of wrapped like in React Router.

The path can also include a wildcard `*`, in which case it will perform a partial match of everything before itself. It can only be at the end of the path:

```js
// In https://example.com/user/abc

// All of these match the current route
<Route path="/*" component={User} />
<Route path="/user/*" component={User} />
<Route path="/user/abc/*" component={User} />
<Route path="/user/:id/*" component={User} />
```

> NOTE: in Crossroad the paths are exact by default, and with the wildcard you can make them partial matches. So the wildcard is the opposite of adding `exact` to React Router.

It can also match query parameters:

```js
// In /profile?page=settings&filter=abc

// All of these match the current route
<Route path="/profile" component={User} />
<Route path="/profile?page" component={User} />
<Route path="/profile?page=settings" component={User} />
<Route path="/profile/*?page=settings" component={User} />
<Route path="/:id?page=settings" component={User} />
<Route path="/:id/*?page=settings" component={User} />

// These shall not match:
<Route path="/?page" component={User} />  // Wrong path
<Route path="/profile?page2" component={User} />  // Wrong key
<Route path="/profile?page=options" component={User} />  // Wrong value
```

### `<Redirect />`

Go to the given url when this component is rendered. It should be used with a `Switch`:

```js
<Switch>
  <Route ... />
  <Route ... />
  ...
  <Redirect to="/" />
</Switch>
```

This way, when nothing else is matched in the Switch, then the redirect will be triggered and go to the homepage (`/`) or any other url we want.

### `<a>`

Links with Crossroad are just traditional plain `<a>`. You write the URL and a relative path, and Crossroad handles all the history, routing, etc:

```js
export default function Message() => (
  Hello! <a href="/">go home</a> or to <a href="/latest">latests</a> for more info.
);
```

Add a `target="_blank"` to open them in a new page, or `target="_self"` to do a full refresh in the current page.

### `useUrl()`

Read and set the full URL:

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
  - `url.href`: a string with the full URL (path + query + hash)
  - `url.path`: a string with the current pathname
  - `url.query`: an object with the keys and values. Example: `{ q: 'hello' }`, `{ q: 'hello', s: 'world' }`.
  - `url.hash`: the hashtag, without the "#"
- `setUrl()`: a setter in the React Hooks style
  - `setUrl("/newpath?search=hello")`: a shortcut with the string
  - `setUrl({ path: '/newpath' })`: set the path (and delete anything else if any)
  - `setUrl({ path: '/newpath', query: { hello: 'world' } })`: update the path and query (and delete the hash if any)
  - `setUrl(prev => ...)`: use the previous url (object)

The resulting `url` is an object containing each of the parts of the URL:

```js
// In /whatever?filter=hello#world
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

By default `setUrl()` will create a new entry in the browser history. If you want to instead replace the current entry you can pass a second parameter with `{ mode: 'replace' }`:

```js
setUrl("/newurl", { mode: "replace" });
```

### `usePath()`

Read and set only the path(name) part of the URL:

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

By default `setPath()` will create a new entry in the browser history. If you want to instead replace the current entry you can pass a second parameter with `{ mode: 'replace' }`:

```js
setPath("/newurl", { mode: "replace" });
```

### `useQuery()`

Read and set only the search query parameters from the URL:

```js
// In /users?search=name&filter=new
const [query, setQuery] = useQuery();
// { search: 'name', filter: 'new' }

setQuery({ search: "myname" }); // Remove the other query params
// Goto /users?search=myname

setQuery({ ...query, search: "myname" }); // Keep the other query params
// Goto /users?search=myname&filter=new
```

If you pass a parameter, it can read and modify that parameter while keeping the others the same. This is specially useful in e.g. a search form:

```js
// In /users?search=name&filter=new
const [search, setSearch] = useQuery("search");
// 'name'

setQuery("myname");
// Goto /users?search=myname&filter=new
```

When you update it, it will clean any parameter not passed, so make sure to pass the old ones if you want to keep them or a new object if you want to scrub them:

```js
// In /users?search=name&filter=new
const [query, setQuery] = useQuery();

setQuery({ search: "myname" }); // Goto /users?q=myname  (removes the filter)
setQuery({ ...query, search: "myname" }); // Goto /users?q=myname&filter=new
setQuery(prev => ({ ...prev, search: "myname" })); // Goto /users?q=myname&filter=new
```

`setQuery` only modifies the query string part of the URL, keeping the `path` and `hash` the same as they were previously.

By default `setQuery()` will create a new entry in the browser history. If you want to instead replace the current entry, so that the "Back" button goes to the previous page, you can pass a second parameter with `{ mode: 'replace' }`:

```js
setQuery({ search: "abc" }, { mode: "replace" });
```

### `useHash()`

Read and set only the hash part of the URL:

```js
// In /login#welcome
const [hash, setHash] = useHash();
// welcome

setHash("bye");
// Goto /login#bye
```

By default `setHash()` will create a new entry in the browser history. If you want to instead replace the current entry you can pass a second parameter with `{ mode: 'replace' }`:

```js
setHash("newhash", { mode: "replace" });
```

### `useParams()`

Parse the current URL against the given reference:

```js
// In /users/2
const params = useParams("/users/:id");
// { id: '2' }
```

It's not this method responsibility to match the url, just to attempt to parse it, so if there's no good match it'll just return an empty object (use a `<Route />` for path matching):

```js
// In /pages/settings
const params = useParams("/users/:id");
// {}
```

## Examples

### Static routes

### Vanity URLs

### Search page

### Query routing

### Not found

### Github hosting

> NOTE: this is a bad idea for SEO, but if that doesn't matter much for you...

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
