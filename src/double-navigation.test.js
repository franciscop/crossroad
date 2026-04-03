import React from "react";
import $ from "react-test";

import { Mock } from "../test/index.js";
import Router, { Route } from "./index.js";

// App with a path+hash link to reproduce the non-StrictMode bug
const AppWithHashLink = ({ url = "/user" }) => (
  <Mock url={url}>
    <Router>
      <Route path="/" render={() => <div>Home</div>} />
      <Route path="/user" render={() => <div>User <a href="/#section">go home</a></div>} />
    </Router>
  </Mock>
);

// App with a plain path link for the StrictMode test
const App = ({ url = "/" }) => (
  <Mock url={url}>
    <Router>
      <Route path="/" render={() => <div>Home <a href="/user">go</a></div>} />
      <Route path="/user" render={() => <div>User</div>} />
    </Router>
  </Mock>
);

describe("double navigation", () => {
  let pushState;

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation((err) => {
      if (!err.message?.includes("Not implemented: navigation")) {
        console.log(err);
      }
    });
    pushState = jest.spyOn(history, "pushState");
  });

  afterEach(() => {
    console.error.mockRestore();
    pushState.mockRestore();
  });

  it("clicking a path+hash link creates only one history entry", async () => {
    const $app = $(<AppWithHashLink />);
    pushState.mockClear();

    await $app.find("a").click();

    // Bug: setUrl(path) + window.location.hash = hash creates TWO history entries.
    // There should be exactly one pushState call with the full URL.
    expect(pushState).toHaveBeenCalledTimes(1);
    expect(pushState).toHaveBeenCalledWith({}, null, "/#section");
  });

  it("clicking a link in StrictMode creates only one history entry", async () => {
    const $app = $(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
    pushState.mockClear();

    await $app.find("a").click();

    // Bug: history.pushState is a side effect inside the setState updater.
    // React StrictMode double-invokes state updaters in dev, firing it twice.
    expect(pushState).toHaveBeenCalledTimes(1);
  });
});
