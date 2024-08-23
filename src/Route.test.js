import React, { useEffect, useState } from "react";
import $ from "react-test";

import { Mock } from "../test/index.js";
import Router, { Route, Switch, useUrl } from "./index.js";

const Home = () => <div>Home</div>;
const User = ({ id }) => <div>User{id ? " " + id : null}</div>;

describe("Route.js", () => {
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

  // React-Test@0.13 cannot catch an error during render()
  it.skip("needs one of the three props", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    try {
      expect(() => {
        $(
          <Router url="/">
            <Route path="/" />
          </Router>
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
            <button onClick={() => setShow(false)}>Hello</button>
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

  it("can render with render, component or children", () => {
    expect(
      <Mock url="/">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>
    ).toHaveText("Home");
    expect(
      <Mock url="/">
        <Router>
          <Route path="/" render={() => <Home />} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>
    ).toHaveText("Home");
    expect(
      <Mock url="/">
        <Router>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/user" component={User} />
        </Router>
      </Mock>
    ).toHaveText("Home");
  });

  it("can deal with partial matches", () => {
    const $home = $(
      <Mock url="/hello">
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
      <Mock url="/user/abc">
        <Router>
          <Route path="/*" component={Home} />
          <Route path="/user/:id" component={User} />
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("HomeUser abc");
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
      <Mock url="/">
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
    await $app.find('a[href="/"]').click();
    expect(mounted).toBe(1);
    expect(rendered).toBe(3);
  });
});
