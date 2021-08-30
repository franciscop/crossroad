import React, { useEffect } from "react";
import $ from "react-test";

import { Catcher, Mock } from "../test/index.js";
import Router, { Route, Switch, Redirect, useUrl } from "./index.js";

const Home = () => <div>Home</div>;
const User = ({ id }) => <div>User{id ? " " + id : null}</div>;
const Other = () => <div>Other</div>;

describe("crossroad", () => {
  it("can render the home", () => {
    const $home = $(
      <Mock path="/">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Home");
  });

  it("can render with render, component or children", () => {
    expect(
      <Mock path="/">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>
    ).toHaveText("Home");
    expect(
      <Mock path="/">
        <Router>
          <Route path="/" render={() => <Home />} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>
    ).toHaveText("Home");
    expect(
      <Mock path="/">
        <Router>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/user" component={User} />
        </Router>
      </Mock>
    ).toHaveText("Home");
  });

  it("can render a different path", () => {
    const $home = $(
      <Mock path="/user">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("User");
  });

  it("can deal with partial matches", () => {
    const $home = $(
      <Mock path="/hello">
        <Router>
          <Route path="/*" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Home");
  });

  it("can deal with multiple partial matches", () => {
    const $home = $(
      <Mock path="/user/abc">
        <Router>
          <Route path="/*" component={Home} />
          <Route path="/user/:id" component={User} />
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("HomeUser abc");
  });

  it("can redirect", () => {
    const $home = $(
      <Mock path="/user/abc">
        <Router>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/user/" component={User} />
            <Redirect to="/" />
          </Switch>
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Home");
  });

  it.skip("needs to be wrapped in <Router />", () => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    try {
      const $home = $(
        <Mock path="/">
          <Route path="/" component={Home} />
        </Mock>
      );
      console.log("AAA");
    } catch (error) {
      console.log("ERROR:", error);
    }

    console.warn.mockRestore();
    console.error.mockRestore();

    // expect($home.text()).toBe("Hooks should be used as children of <Router>");
  });
});

describe("<Switch>", () => {
  it("can handle a simple switch", () => {
    const $home = $(
      <Mock path="/user/abc">
        <Router>
          <Switch>
            <Route path="/*" component={Home} />
            <Route path="/user/:id" component={User} />
            <Route path="/hello" component={Other} />
          </Switch>
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Home");
  });

  it.skip("needs one of the three props", () => {
    const error = console.error;
    console.error = () => {};

    const $home = $(
      <Catcher>
        <Mock path="/">
          <Router>
            <Switch>
              <Route path="/" />
            </Switch>
          </Router>
        </Mock>
      </Catcher>
    );
    console.error = error;

    expect($home.text()).toContain(
      "Route needs the prop `component`, `render` or `children`"
    );
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
      <Catcher>
        <Mock path="/">
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
      </Catcher>
    );

    const $app = $(<App />);
    expect(mounted).toBe(1);
    expect(rendered).toBe(1);
    await $app.find("a:nth-child(2)").click();
    expect(mounted).toBe(1);
    expect(rendered).toBe(2);
    await $app.find("a:nth-child(1)").click();
    expect(mounted).toBe(1);
    expect(rendered).toBe(3);
  });
});
