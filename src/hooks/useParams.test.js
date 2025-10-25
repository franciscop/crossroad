import React from "react";
import $ from "react-test";
import { Mock, withPath } from "../../test/index.js";
import Router, { Route, useParams } from "../index.js";

const stringify = (p) => <div>{JSON.stringify(p)}</div>;

describe("useParams", () => {
  it("can use the useParams", () => {
    const MyUser = () => {
      const params = useParams();
      return <div>{JSON.stringify(params)}</div>;
    };
    const $user = $(
      <Router url="/users/25">
        <Route path="/users/:id" component={MyUser} />
      </Router>,
    );
    expect(JSON.parse($user.text())).toEqual({ id: "25" });
  });

  it("can use the useParams with types", () => {
    const MyUser = () => {
      const params = useParams();
      return <div>{JSON.stringify(params)}</div>;
    };
    const $user = $(
      <Router url="/users/25">
        <Route path="/users/:id<number>" component={MyUser} />
      </Router>,
    );
    expect(JSON.parse($user.text())).toEqual({ id: 25 });
  });

  it("can parse the path into parameters", () => {
    const $user = withPath("/", () => <Route path="/" render={stringify} />);
    expect($user.text()).toEqual("{}");
  });

  it("can parse multiple parameters", async () => {
    const $user = withPath("/users/25", () => (
      <Route path="/:page/:id" render={stringify} />
    ));

    expect(JSON.parse($user.text())).toEqual({ page: "users", id: "25" });
  });

  it("can parse multiple parameters with types", async () => {
    const $user = withPath("/users/25", () => (
      <Route path="/:page/:id<number>" render={stringify} />
    ));

    expect(JSON.parse($user.text())).toEqual({ page: "users", id: 25 });
  });

  it("can parse multiple parameters with types", async () => {
    const $user = withPath("/users/25/about", () => (
      <Route path="/:page/:id<number>/about" render={stringify} />
    ));
    expect(JSON.parse($user.text())).toEqual({ page: "users", id: 25 });
  });

  it("is empty when it doesn't match", async () => {
    const $user = withPath("/users/25", () => (
      <Route path="/xxx/:id" render={stringify} />
    ));
    expect($user.text()).toEqual("");
  });

  it("is empty when there's no params", async () => {
    const $user = withPath("/users", () => (
      <Route path="/users" render={stringify} />
    ));
    expect(JSON.parse($user.text())).toEqual({});
  });

  it("will inherit params from the Route", async () => {
    const Comp = () => {
      const params = useParams();
      return <div>{JSON.stringify(params)}</div>;
    };
    const $user = $(
      <Mock url="/user/2">
        <Router>
          <Route path="/user/:id">
            <Comp />
          </Route>
        </Router>
      </Mock>,
    );
    expect(JSON.parse($user.text())).toEqual({ id: "2" });
  });

  it("keeps independent branches", async () => {
    const Comp = () => {
      const params = useParams();
      return <div>{JSON.stringify(params)}</div>;
    };
    const $user = $(
      <Mock url="/2">
        <Router>
          <Route path="/:id">
            <Comp />
          </Route>
          <Route path="/:username">
            <Comp />
          </Route>
          <Route path="/*">
            <Comp />
          </Route>
        </Router>
      </Mock>,
    );
    expect($user.text()).toBe(`{"id":"2"}{"username":"2"}{}`);
  });
});

describe("useParams types", () => {
  it("defaults to string", async () => {
    const $user = $(
      <Router url="/users/25">
        <Route path="/users/:id" render={(p) => <div>{typeof p.id}</div>} />
      </Router>,
    );
    expect($user.text()).toEqual("string");
  });

  it("defaults to string", async () => {
    const $user = $(
      <Router url="/users/25">
        <Route
          path="/users/:id<number>"
          render={(p) => <div>{typeof p.id}</div>}
        />
      </Router>,
    );
    expect($user.text()).toEqual("number");
  });
});
