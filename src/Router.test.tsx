import React, { useEffect, useState } from "react";
import $ from "react-test";

import { Mock } from "./helpers";
import isServer from "./helpers/isServer";
import Router, { Route, Switch, useUrl } from "./index";

vi.mock("./helpers/isServer.ts", () => ({ default: vi.fn(() => false) }));

const Home = () => <div>Home</div>;
const User = ({ id }: { id?: string }) => <div>User{id ? " " + id : null}</div>;
const Other = () => <div>Other</div>;

describe("crossroad", () => {
  afterEach(() => {
    vi.mocked(isServer).mockImplementation(() => false);
  });

  it("can overload the home", () => {
    const $home = $(
      <Mock url="/user">
        <Router url="/">
          <Route path="/" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>,
    );
    expect($home.text()).toBe("Home");
  });

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

  // React-Test@0.13 cannot read an error thrown during render()
  it("needs to be wrapped with <Router>", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const $route = $(
      <Mock url="/">
        <Route path="/" />
      </Mock>,
    );
    expect($route).toHaveError("Wrap your App with <Router>");

    vi.mocked(console.error).mockRestore();
  });

  it("cannot navigate when there is no window", async () => {
    vi.mocked(isServer).mockImplementation(() => true);

    const Home = () => (
      <div>
        Home <a href="/user">go</a>
      </div>
    );
    const User = ({ id }: { id?: string }) => <div>User{id ? " " + id : null}</div>;

    const $home = $(
      <Mock url="/">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>,
    );
    expect($home.text()).toBe("Home go");
    await $home.find("a").click();
    expect($home.text()).toBe("Home go");

    vi.mocked(isServer).mockImplementation(() => false);
  });

  it("can navigate when there is window", async () => {
    const Home = () => (
      <div>
        Home <a href="/user">go</a>
      </div>
    );
    const User = ({ id }: { id?: string }) => <div>User</div>;

    const $home = $(
      <Mock url="/">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>,
    );
    expect($home.text()).toBe("Home go");
    await $home.find("a").click();
    expect($home.text()).toBe("User");

    vi.mocked(isServer).mockImplementation(() => false);
  });
});
