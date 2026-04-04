import Router from "./Router.tsx";
import Route from "./Route.tsx";
import Switch from "./Switch.ts";
import Context from "./Context.ts";

import useUrl from "./hooks/useUrl.ts";
import usePath from "./hooks/usePath.ts";
import useQuery from "./hooks/useQuery.ts";
import useHash from "./hooks/useHash.ts";
import useParams from "./hooks/useParams.ts";

export default Router;
export {
  Route,
  Switch,
  useUrl,
  usePath,
  useQuery,
  useHash,
  useParams,
  Context
};
