import React from "react";
import $ from "react-test";

import { stringify } from "./helpers/format";
import { Mock } from "./helpers";
import useUrl from "./hooks/useUrl";
import Router, { Route } from "./index";

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
    vi.spyOn(console, "error").mockImplementation((err: any) => {
      if (
        !String(err?.message ?? err).includes("Not implemented: navigation")
      ) {
        console.log(err);
      }
    });
  });
  afterEach(() => {
    if ((console.error as any).mockRestore) {
      (console.error as any).mockRestore();
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
    const fn = vi.fn();
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

describe("relative links", () => {
  const Show = ({ link }: { link: React.ReactNode }) => {
    const [url] = useUrl();
    return (
      <div>
        <span>{stringify(url)}</span>
        {link}
      </div>
    );
  };

  const withLink = (url: string, link: React.ReactNode) =>
    $(
      <Mock url={url}>
        <Router>
          <Show link={link} />
        </Router>
      </Mock>,
    );

  it("keeps the current path for a query-only link", async () => {
    const $page = withLink("/lessons/26", <a href="?tab=examples">go</a>);
    await $page.find("a").click();
    expect($page.find("span").text()).toBe("/lessons/26?tab=examples");
    expect(window.location.pathname).toBe("/lessons/26");
    expect(window.location.search).toBe("?tab=examples");
  });

  it("resolves a relative path link against the current path", async () => {
    const $page = withLink("/a/b", <a href="other">go</a>);
    await $page.find("a").click();
    expect($page.find("span").text()).toBe("/a/other");
  });

  it("resolves a ./ link against the current path", async () => {
    const $page = withLink("/a/b", <a href="./other?x=1">go</a>);
    await $page.find("a").click();
    expect($page.find("span").text()).toBe("/a/other?x=1");
  });

  it("keeps the current path when calling setUrl with a query", async () => {
    const Button = () => {
      const [, setUrl] = useUrl();
      return <button onClick={() => setUrl("?q=1")}>go</button>;
    };
    const $page = withLink("/lessons/26", <Button />);
    await $page.find("button").click();
    expect($page.find("span").text()).toBe("/lessons/26?q=1");
  });
});
