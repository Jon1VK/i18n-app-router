import { compile } from "path-to-regexp";
import { RouterError } from "./errors";
import {
  schema,
  type DynamicRoute,
  type Locale,
  type Route,
  type RouteParams,
} from "./schema";

type CompileHrefOptions<R extends Route> = {
  locale?: Locale;
} & (R extends DynamicRoute
  ? { params: RouteParams<R> }
  : { params?: undefined });

export function useHrefFactory(useLocale: () => Locale) {
  return function useHref<R extends Route>(
    route: R,
    opts?: CompileHrefOptions<NoInfer<R>>
  ) {
    const localizedPaths = schema.routes[route];
    if (!localizedPaths) throw new RouterError(`Invalid route "${route}"`);
    const locale = opts?.locale ?? useLocale();
    const path = localizedPaths[locale];
    if (!path) throw new RouterError(`Invalid locale "${locale}"`);
    if (!opts?.params) return path;
    const compiler = compile(path);
    return compiler(opts.params);
  };
}
