import $ from "react-test";

import Router, { Route, Switch } from "./index";
import { Mock } from "./helpers";

describe("use the url prop", () => {
  const Home = () => <div>Home</div>;
  const Users = () => <div>Users</div>;
  const NotFound = () => <div>Website not found</div>;

  const App = ({ url }: { url: string }) => (
    <Router url={url}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/users" component={Users} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );

  it("renders the home component on /", () => {
    expect($(<App url="/" />).text()).toBe("Home");
  });

  it("renders the user list on /users", () => {
    expect($(<App url="/users" />).text()).toBe("Users");
  });

  it("renders not found when in another route", () => {
    expect($(<App url="/bla" />).text()).toContain("not found");
  });
});

describe("use the Mock component", () => {
  const Home = () => <div>Home</div>;
  const Users = () => <div>Users</div>;
  const NotFound = () => <div>Website not found</div>;

  const App = () => (
    <Router>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/users" component={Users} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );

  it("renders the home component on /", () => {
    expect(
      $(
        <Mock url="/">
          <App />
        </Mock>,
      ).text(),
    ).toBe("Home");
  });

  it("renders the user list on /users", () => {
    expect(
      $(
        <Mock url="/users">
          <App />
        </Mock>,
      ).text(),
    ).toBe("Users");
  });

  it("renders not found when in another route", () => {
    expect(
      $(
        <Mock url="/bla">
          <App />
        </Mock>,
      ).text(),
    ).toContain("not found");
  });
});
