import Router from "./Router.js";
import Route from "./Route.js";
import Switch from "./Switch.js";
import Context from "./Context.js";

import useUrl from "./hooks/useUrl.js";
import usePath from "./hooks/usePath.js";
import useQuery from "./hooks/useQuery.js";
import useHash from "./hooks/useHash.js";
import useParams from "./hooks/useParams.js";

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
