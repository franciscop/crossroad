import React, { useEffect, useState } from "react";
import $ from "react-test";

import { Mock } from "../test/index.js";
import Router, { Route, Switch } from "./index.js";

const Home = () => <div>Home</div>;
const User = ({ id }) => <div>User{id ? " " + id : null}</div>;
const Other = () => <div>Other</div>;

describe("<Switch>", () => {
  it("can handle a simple switch", () => {
    const $home = $(
      <Mock url="/user/abc">
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

  it("matches a route without path", () => {
    const $home = $(
      <Mock url="/fdsgsrf/dfgas">
        <Router>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/user/:id" component={User} />
            <Route component={Other} />
          </Switch>
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Other");
  });

  it("does not blow up empty", () => {
    const $home = $(
      <Mock url="/user/abc">
        <Router>
          <Switch></Switch>
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("");
  });

  it("does not blow up with a string", () => {
    const $home = $(
      <Mock url="/user/abc">
        <Router>
          <Switch>abc</Switch>
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("");
  });

  it("can redirect", () => {
    const $home = $(
      <Mock url="/user/abc">
        <Router>
          <Switch redirect="/">
            <Route path="/" component={Home} />
            <Route path="/user/" component={User} />
          </Switch>
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Home");
  });

  it("can redirect with an object", () => {
    const $home = $(
      <Mock url="/user/abc">
        <Router>
          <Switch redirect={{ path: "/" }}>
            <Route path="/" component={Home} />
            <Route path="/user/" component={User} />
          </Switch>
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Home");
  });

  it("can redirect with a function", () => {
    const $home = $(
      <Mock url="/user/abc">
        <Router>
          <Switch redirect={() => "/"}>
            <Route path="/" component={Home} />
            <Route path="/user/" component={User} />
          </Switch>
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Home");
  });
});
