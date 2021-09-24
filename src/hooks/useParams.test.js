import React, { useEffect } from "react";
import $ from "react-test";

import { Mock, withPath } from "../../test/index.js";

import Router, { Route, useParams } from "../index.js";

describe("useParams", () => {
  it("can parse the path into parameters", () => {
    const $user = withPath("/user?hello=world#there", () => {
      const params = useParams("/:id");
      return <div>{JSON.stringify(params)}</div>;
    });
    expect(JSON.parse($user.text())).toEqual({ id: "user" });
  });

  it("can parse multiple parameters", async () => {
    const $user = withPath("/user/2", () => {
      const params = useParams("/:page/:id");
      return <div>{JSON.stringify(params)}</div>;
    });
    expect(JSON.parse($user.text())).toEqual({ page: "user", id: "2" });
  });

  it("can parse intermediate parameters", async () => {
    const $user = withPath("/user/2/about", () => {
      const params = useParams("/:page/:id/about");
      return <div>{JSON.stringify(params)}</div>;
    });
    expect(JSON.parse($user.text())).toEqual({ page: "user", id: "2" });
  });

  it("is empty when it doesn't match", async () => {
    const $user = withPath("/user/2", () => {
      const params = useParams("/xxx/:id/");
      return <div>{JSON.stringify(params)}</div>;
    });
    expect(JSON.parse($user.text())).toEqual({});
  });

  it("is empty when it doesn't match even in the end", async () => {
    const $user = withPath("/user/2/about", () => {
      const params = useParams("/user/:id/xxx");
      return <div>{JSON.stringify(params)}</div>;
    });
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
      </Mock>
    );
    expect(JSON.parse($user.text())).toEqual({ id: "2" });
  });

  it("overwrites params if a string is given", async () => {
    const Comp = () => {
      const params = useParams("/:username");
      return <div>{JSON.stringify(params)}</div>;
    };
    const $user = $(
      <Mock url="/2">
        <Router>
          <Route path="/:id">
            <Comp />
          </Route>
        </Router>
      </Mock>
    );
    expect(JSON.parse($user.text())).toEqual({ username: "2" });
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
      </Mock>
    );
    expect($user.text()).toBe(`{"id":"2"}{"username":"2"}{}`);
  });
});
