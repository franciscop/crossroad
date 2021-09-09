import React, { useEffect, useState } from "react";
import $ from "react-test";

import { Mock } from "../test/index.js";
import Router, { Route, Switch, useUrl } from "./index.js";

const Home = () => <div>Home</div>;
const User = ({ id }) => <div>User{id ? " " + id : null}</div>;
const Other = () => <div>Other</div>;

const delay = time => new Promise(done => setTimeout(done, time));

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

  it("can overload the home", () => {
    const $home = $(
      <Mock path="/user">
        <Router url="/">
          <Route path="/" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Home");
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
          <Switch redirect="/">
            <Route path="/" component={Home} />
            <Route path="/user/" component={User} />
          </Switch>
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Home");
  });

  it("needs to be wrapped in <Router />", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    try {
      expect(() => {
        $(
          <Mock path="/">
            <Route path="/" component={Home} />
          </Mock>
        );
      }).toThrow();
    } finally {
      console.error.mockRestore();
    }
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

  it("matches a route without path", () => {
    const $home = $(
      <Mock path="/fdsgsrf/dfgas">
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
      <Mock path="/user/abc">
        <Router>
          <Switch></Switch>
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("");
  });

  it("needs one of the three props", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    try {
      expect(() => {
        $(
          <Mock path="/">
            <Router>
              <Switch>
                <Route path="/" />
              </Switch>
            </Router>
          </Mock>
        );
      }).toThrow();
    } finally {
      console.error.mockRestore();
    }
  });

  it("unmounts without any issue", async () => {
    const App = () => {
      const [show, setShow] = useState(true);
      if (show) {
        return (
          <Router>
            <button onClick={e => setShow(false)}>Hello</button>
          </Router>
        );
      }
      return <div>Bye</div>;
    };
    const $app = $(
      <div>
        <App />
      </div>
    );
    expect($app.text()).toBe("Hello");
    await $app.find("button").click();
    expect($app.text()).toBe("Bye");
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
