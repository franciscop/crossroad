// App.test.js
import React from "react";
import $ from "react-test";

import Router, { Switch, Route } from "../src/index.js";
import Mock from "./Mock";

describe("use the url prop", () => {
  // Imagine these are your apps and components:
  const Home = () => <div>Home</div>;
  const Users = () => <div>Users</div>;
  const NotFound = () => <div>Website not found</div>;

  const App = ({ url }) => {
    return (
      <Router url={url}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/users" component={Users} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  };

  it("renders the home component on /", () => {
    const $home = $(<App url="/" />);
    expect($home.text()).toBe("Home");
  });

  it("renders the user list on /users", () => {
    const $home = $(<App url="/users" />);
    expect($home.text()).toBe("Users");
  });

  it("renders not found when in another route", () => {
    const $home = $(<App url="/bla" />);
    expect($home.text()).toContain("not found");
  });
});

describe("use the Mock component", () => {
  // Imagine these are your apps and components:
  const Home = () => <div>Home</div>;
  const Users = () => <div>Users</div>;
  const NotFound = () => <div>Website not found</div>;

  const App = () => {
    return (
      <Router>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/users" component={Users} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  };

  it("renders the home component on /", () => {
    const $home = $(
      <Mock url="/">
        <App />
      </Mock>
    );
    expect($home.text()).toBe("Home");
  });

  it("renders the user list on /users", () => {
    const $home = $(
      <Mock url="/users">
        <App />
      </Mock>
    );
    expect($home.text()).toBe("Users");
  });

  it("renders not found when in another route", () => {
    const $home = $(
      <Mock url="/bla">
        <App />
      </Mock>
    );
    expect($home.text()).toContain("not found");
  });
});
