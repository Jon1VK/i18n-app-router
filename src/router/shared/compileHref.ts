import { compile } from "path-to-regexp";
import { getLocale } from "../server/getLocale";
import { RouterError } from "./errors";
import {
  schema,
  type DynamicRoute,
  type Route,
  type RouteLocale,
  type RouteParams,
} from "./schema";

type CompileHrefOptions<R extends Route> = {
  locale?: RouteLocale;
} & (R extends DynamicRoute
  ? { params: RouteParams<R> }
  : { params?: undefined });

export function compileHref<R extends Route>(
  route: R,
  opts?: CompileHrefOptions<NoInfer<R>>
) {
  const localizedPaths = schema.routes[route];
  if (!localizedPaths) throw new RouterError(`Invalid route "${route}"`);
  const locale = opts?.locale ?? getLocale();
  const path = localizedPaths[locale];
  if (!path) throw new RouterError(`Invalid locale "${locale}"`);
  if (!opts?.params) return path;
  const compiler = compile(path);
  return compiler(opts.params);
}
