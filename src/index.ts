import Router from "./Router";
import Route from "./Route";
import Switch from "./Switch";
import Context from "./Context";

import useUrl from "./hooks/useUrl";
import usePath from "./hooks/usePath";
import useQuery from "./hooks/useQuery";
import useHash from "./hooks/useHash";
import useParams from "./hooks/useParams";

export default Router;
export {
  Route,
  Switch,
  useUrl,
  usePath,
  useQuery,
  useHash,
  useParams,
  Context,
};
