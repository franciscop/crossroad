import React, { useEffect, useState } from "react";
import $ from "react-test";

import { Mock } from "../test/index.js";
import Router, { Route, Switch, useUrl } from "./index.js";

const Home = () => <div>Home</div>;
const User = ({ id }) => <div>User{id ? " " + id : null}</div>;

describe("Route.js", () => {
  it("can render the home", () => {
    const $home = $(
      <Mock url="/">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>,
    );
    expect($home.text()).toBe("Home");
  });

  // React-Test@0.13 cannot catch an error during render()
  it("needs one of the three props", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    const $route = $(
      <Router url="/">
        <Route path="/" />
      </Router>,
    );

    expect($route).toHaveError(
      "Route needs prop `component`, `render` or `children`",
    );
    console.error.mockRestore();
  });

  it("unmounts without any issue", async () => {
    const App = () => {
      const [show, setShow] = useState(true);
      if (show) {
        return (
          <Router>
            <button onClick={() => setShow(false)}>Hello</button>
          </Router>
        );
      }
      return <div>Bye</div>;
    };
    const $app = $(
      <div>
        <App />
      </div>,
    );
    expect($app.text()).toBe("Hello");
    await $app.find("button").click();
    expect($app.text()).toBe("Bye");
  });

  it("can render with render, component or children", () => {
    expect(
      <Mock url="/">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>,
    ).toHaveText("Home");
    expect(
      <Mock url="/">
        <Router>
          <Route path="/" render={() => <Home />} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>,
    ).toHaveText("Home");
    expect(
      <Mock url="/">
        <Router>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/user" component={User} />
        </Router>
      </Mock>,
    ).toHaveText("Home");
  });

  it("can deal with partial matches", () => {
    const $home = $(
      <Mock url="/hello">
        <Router>
          <Route path="/*" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>,
    );
    expect($home.text()).toBe("Home");
  });

  it("can deal with multiple partial matches", () => {
    const $home = $(
      <Mock url="/user/abc">
        <Router>
          <Route path="/*" component={Home} />
          <Route path="/user/:id" component={User} />
        </Router>
      </Mock>,
    );
    expect($home.text()).toBe("HomeUser abc");
  });

  it("parses the types as strings by default", () => {
    const $home = $(
      <Mock url="/users/abc/books/def">
        <Router>
          <Route
            path="/users/:userId/books/:bookId"
            component={({ userId, bookId }) => (
              <div>
                {userId} ({typeof userId}) - {bookId} ({typeof bookId})
              </div>
            )}
          />
        </Router>
      </Mock>,
    );
    expect($home.text()).toBe("abc (string) - def (string)");
  });

  it("parses the types as explicit strings", () => {
    const $home = $(
      <Mock url="/users/abc/books/def">
        <Router>
          <Route
            path="/users/:userId<string>/books/:bookId<string>"
            component={({ userId, bookId }) => (
              <div>
                {userId} ({typeof userId}) - {bookId} ({typeof bookId})
              </div>
            )}
          />
        </Router>
      </Mock>,
    );
    expect($home.text()).toBe("abc (string) - def (string)");
  });

  it("parses the types as explicit numbers", () => {
    const $home = $(
      <Mock url="/users/25/books/55">
        <Router>
          <Route
            path="/users/:userId<number>/books/:bookId<number>"
            component={({ userId, bookId }) => (
              <div>
                {userId} ({typeof userId}) - {bookId} ({typeof bookId})
              </div>
            )}
          />
        </Router>
      </Mock>,
    );
    expect($home.text()).toBe("25 (number) - 55 (number)");
  });

  it("parses the types as explicit dates", () => {
    const $home = $(
      <Mock url="/users/2025-12-31/books/1735660861000">
        <Router>
          <Route
            path="/users/:userId<date>/books/:bookId<date>"
            component={({ userId, bookId }) => (
              <div>
                {userId.toISOString()} {bookId.toISOString()}
              </div>
            )}
          />
        </Router>
      </Mock>,
    );
    expect($home.text()).toBe(
      "2025-12-31T00:00:00.000Z 2024-12-31T16:01:01.000Z",
    );
  });

  it("parses the types as explicit booleans", () => {
    const $home = $(
      <Mock url="/users/true/books/false">
        <Router>
          <Route
            path="/users/:userId<boolean>/books/:bookId<boolean>"
            component={({ userId, bookId }) => (
              <div>
                {String(userId)} ({typeof userId}) - {String(bookId)} (
                {typeof bookId})
              </div>
            )}
          />
        </Router>
      </Mock>,
    );
    expect($home.text()).toBe("true (boolean) - false (boolean)");
  });

  // According to this React Router comment:
  // https://github.com/remix-run/react-router/blob/main/packages/react-router/modules/Switch.js#L23-L26
  // The Switch might trigger a remount, which we ofc want to avoid. This test
  // is to make sure there's never a remount
  it("does not trigger a remount", async () => {
    let rendered = 0;
    let mounted = 0;
    const Test = () => {
      const [url] = useUrl();
      useEffect(() => {
        mounted++;
      }, []);
      rendered++;
      return "Hello";
    };

    const App = () => (
      <Mock url="/">
        <Router>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
          </nav>
          <Switch>
            <Route path="/" component={Test} />
            <Route path="/about" component={Test} />
          </Switch>
        </Router>
      </Mock>
    );

    const $app = $(<App />);
    expect(mounted).toBe(1);
    expect(rendered).toBe(1);
    await $app.find("a:nth-child(2)").click();
    expect(mounted).toBe(1);
    expect(rendered).toBe(2);
    await $app.find('a[href="/"]').click();
    expect(mounted).toBe(1);
    expect(rendered).toBe(3);
  });
});
