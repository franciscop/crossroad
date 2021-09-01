import React, { useEffect } from "react";
import $ from "react-test";

import { Mock } from "../test/index.js";
import Router, { Route, Switch, useUrl } from "./index.js";

const Home = () => (
  <div>
    Home <a href="/user">go</a>
  </div>
);
const User = ({ id }) => <div>User{id ? " " + id : null}</div>;
const Other = () => <div>Other</div>;

describe("<a> links", () => {
  it("can use normal links", async () => {
    const $home = $(
      <Mock path="/">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Home go");
    await $home.find("a").click();
    expect($home.text()).toBe("User");
  });

  it("ignores empty links", async () => {
    const Home = () => (
      <div>
        Home <a>go</a>
      </div>
    );
    const $home = $(
      <Mock path="/">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Home go");
    await $home.find("a").click();
    expect($home.text()).toBe("Home go");
  });

  it("ignores absolute links", async () => {
    const Home = () => (
      <div>
        Home <a href="https://example.com/">go</a>
      </div>
    );
    const $home = $(
      <Mock path="/">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Home go");
    await $home.find("a").click();
    expect($home.text()).toBe("Home go");
  });

  it("ignores links with a target", async () => {
    const Home = () => (
      <div>
        Home{" "}
        <a href="/user" target="_blank">
          go
        </a>
      </div>
    );
    const $home = $(
      <Mock path="/">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Home go");
    await $home.find("a").click();
    expect($home.text()).toBe("Home go");
  });
});
