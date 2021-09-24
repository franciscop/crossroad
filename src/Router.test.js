import React, { useEffect, useState } from "react";
import $ from "react-test";

import { Mock } from "../test/index.js";
import Router, { Route, Switch, useUrl } from "./index.js";

import isServer from "./helpers/isServer.js";
jest.mock("./helpers/isServer.js");
isServer.mockImplementation(() => false);

const Home = () => <div>Home</div>;
const User = ({ id }) => <div>User{id ? " " + id : null}</div>;
const Other = () => <div>Other</div>;

describe("crossroad", () => {
  afterEach(() => {
    jest.unmock("./helpers/isServer.js");
  });

  it("can overload the home", () => {
    const $home = $(
      <Mock url="/user">
        <Router url="/">
          <Route path="/" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>
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
      </Mock>
    );
    expect($home.text()).toBe("Home");
  });

  it("needs to be wrapped with <Router>", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    try {
      expect(() => {
        $(
          <Mock url="/">
            <Route path="/" />
          </Mock>
        );
      }).toThrow();
    } finally {
      console.error.mockRestore();
    }
  });

  it("cannot navigate when there is no window", async () => {
    isServer.mockImplementation(() => true);

    const Home = () => (
      <div>
        Home <a href="/user">go</a>
      </div>
    );
    const User = ({ id }) => <div>User{id ? " " + id : null}</div>;

    const $home = $(
      <Mock url="/">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Home go");
    await $home.find("a").click();
    expect($home.text()).toBe("Home go");

    isServer.mockImplementation(() => false);
  });

  it("can navigate when there is window", async () => {
    const Home = () => (
      <div>
        Home <a href="/user">go</a>
      </div>
    );
    const User = ({ id }) => <div>User</div>;

    const $home = $(
      <Mock url="/">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Home go");
    await $home.find("a").click();
    expect($home.text()).toBe("User");

    jest.unmock("./helpers/isServer");
  });
});
