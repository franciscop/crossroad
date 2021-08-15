import React, { useEffect } from "react";
import Router, { Route, Switch, useUrl } from "./index.js";
import $ from "react-test";
import "babel-polyfill";

class Catcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }
  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }
  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return <div>{this.state.error.message}</div>;
    }
    return this.props.children;
  }
}

const Mock = ({ path, children }) => {
  const href = "https://example.com" + path;
  const oldLocation = { value: window.location };
  delete global.window.location;
  Object.defineProperty(global.window, "location", {
    value: new URL(href),
    configurable: true
  });

  useEffect(() => {
    return () => Object.defineProperty(window, "location", oldLocation);
  });
  return <div>{children}</div>;
};

const Home = () => <div>Home</div>;
const HomeButton = () => {
  const [url, setUrl] = useUrl();
  return (
    <div>
      Home <button onClick={e => setUrl("/user")}>Click</button>
    </div>
  );
};
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
          <Route exact={false} path="/" component={Home} />
          <Route path="/user" component={User} />
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Home");
  });

  it("can deal with partial matches", () => {
    const $home = $(
      <Mock path="/user/abc">
        <Router>
          <Route path="/" exact={false} component={Home} />
          <Route path="/user/:id" component={User} />
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("HomeUser abc");
  });
});

describe("<Switch>", () => {
  it("can handle a simple switch", () => {
    const $home = $(
      <Mock path="/user/abc">
        <Router>
          <Switch>
            <Route path="/" exact={false} component={Home} />
            <Route path="/user/:id" component={User} />
            <Route path="/hello" component={Other} />
          </Switch>
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Home");
  });

  it("only accepts routes", () => {
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

  it("only accepts routes", () => {
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
});

describe("setUrl()", () => {
  it("can modify the URL", async () => {
    const $home = $(
      <Mock path="/">
        <Router>
          <Switch>
            <Route path="/user" component={User} />
            <Route path="/" component={HomeButton} />
          </Switch>
        </Router>
      </Mock>
    );
    expect($home.text()).toBe("Home Click");
    await $home.find("button").click();
    expect($home.text()).toBe("User");
  });
});
