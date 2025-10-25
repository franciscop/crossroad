import React from "react";
import $ from "react-test";

import { Mock } from "../test/index.js";
import Router, { Route, Switch, useUrl } from "./index.js";

const Home = <a href="/user">go</a>;
const User = <a href="/">go</a>;

const App = ({ url = "/", homeLink = Home, userLink = User }) => (
  <Mock url={url}>
    <Router>
      <Route path="/" render={() => <div>Home {homeLink}</div>} />
      <Route path="/user" render={() => <div>User {userLink}</div>} />
    </Router>
  </Mock>
);

describe("<a> links", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation((err) => {
      if (!err.message.includes("Not implemented: navigation")) {
        console.log(err);
      }
    });
  });
  afterEach(() => {
    if (console.error.mockRestore) {
      console.error.mockRestore();
    }
  });

  it("can use normal links", async () => {
    const $home = $(<App />);
    expect($home.text()).toBe("Home go");
    await $home.find("a").click();
    expect($home.text()).toBe("User go");
  });

  it("ignores empty links", async () => {
    const $home = $(<App homeLink={<a>go</a>} />);
    expect($home.text()).toBe("Home go");
    await $home.find("a").click();
    expect($home.text()).toBe("Home go");
  });

  it("ignores absolute links", async () => {
    const $home = $(<App homeLink={<a href="https://example.com/">go</a>} />);
    expect($home.text()).toBe("Home go");
    await $home.find("a").click();
    expect($home.text()).toBe("Home go");
  });

  it("ignores links with a target", async () => {
    const $home = $(
      <App
        homeLink={
          <a href="/user" target="_blank">
            go
          </a>
        }
      />,
    );
    expect($home.text()).toBe("Home go");
    await $home.find("a").click();
    expect($home.text()).toBe("Home go");
  });

  it("doesn't trigger for current link", async () => {
    const fn = jest.fn();
    const Home = () => {
      fn();
      return <a href="/">go</a>;
    };
    const $home = $(<App homeLink={<Home />} />);
    expect(fn.mock.calls.length).toBe(1);
    await $home.find("a").click();
    await $home.find("a").click();
    expect(fn.mock.calls.length).toBe(1);
  });

  it("avoids navigation for hash", async () => {
    const $home = $(<App url="/user" userLink={<a href="#user">go</a>} />);
    expect($home.text()).toBe("User go");
    await $home.find("a").click();
    expect($home.text()).toBe("User go");
  });

  it("navigates for path+hash", async () => {
    const $home = $(<App url="/user" userLink={<a href="/#user">go</a>} />);
    expect($home.text()).toBe("User go");
    await $home.find("a").click();
    expect($home.text()).toBe("Home go");
  });
});
