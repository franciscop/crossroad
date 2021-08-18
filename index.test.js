import React, { useEffect } from "react";
import $ from "react-test";

import { Catcher, Mock } from "./test/index.js";
import Router, { Route, Switch, useUrl } from "./index.js";

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

  it.skip("only accepts routes", () => {
    const error = console.error;
    console.error = () => {};

    const $home = $(
      <Catcher>
        <Mock path="/user/abc">
          <Router>
            <Switch>
              <div>Hello</div>
            </Switch>
          </Router>
        </Mock>
      </Catcher>
    );
    console.error = error;

    expect($home.text()).toContain(
      "<Switch> only accepts <Route> or <Redirect> as children"
    );
  });

  it.skip("only accepts routes, even when mixed", () => {
    const error = console.error;
    console.error = () => {};

    const $home = $(
      <Catcher>
        <Mock path="/user/abc">
          <Router>
            <Switch>
              <Route path="/" component={Home} />
              <div>Hello</div>
            </Switch>
          </Router>
        </Mock>
      </Catcher>
    );
    console.error = error;

    expect($home.text()).toContain(
      "<Switch> only accepts <Route> or <Redirect> as children"
    );
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
});
