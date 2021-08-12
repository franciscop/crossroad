import React, { createContext } from "react";

const parseUrl = url => {
  return new URL(url);
};

export const RouterContext = createContext({});

const Router = ({ children }) => {
  const url = {};
  const history = {};
  return (
    <RouterContext.Provider value={{ url, history }}>
      {children}
    </RouterContext.Provider>
  );
};
