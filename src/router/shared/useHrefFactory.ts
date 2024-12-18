import {
  schema,
  type DynamicRoute,
  type Locale,
  type Route,
  type RouteParams,
} from "next-globe-gen/schema";
import { compile } from "path-to-regexp";

export type UseHrefOptions<R extends Route> = {
  route: R;
  locale?: Locale;
  query?: Record<string, string>;
} & (R extends DynamicRoute
  ? { params: RouteParams<R> }
  : { params?: undefined });

export type UseHrefArgs<R extends Route> =
  | (R extends DynamicRoute
      ? [route: R, params: RouteParams<R>, locale?: Locale]
      : [route: R, locale?: Locale, _?: undefined])
  | [options: UseHrefOptions<R>, _?: undefined, __?: undefined];

export function useHrefFactory(useLocale: () => Locale) {
  return function useHref<R extends Route>(...args: UseHrefArgs<R>) {
    const { route, params, query, locale } = extractUseHrefOptions(args);
    const localizedPaths = schema.routes[route];
    if (!localizedPaths) throw new Error(`Invalid route "${route}"`);
    const path = localizedPaths[locale ?? useLocale()];
    if (!path) throw new Error(`Invalid locale "${locale}"`);
    const searchParams = new URLSearchParams(query);
    const compiler = compile(path);
    return `${compiler(params)}?${searchParams}`;
  };
}

export function extractUseHrefOptions<R extends Route>(args: UseHrefArgs<R>) {
  const [arg1, arg2, arg3] = args;
  if (typeof arg1 === "object") return arg1;
  const route = arg1;
  const params = typeof arg2 === "object" ? arg2 : undefined;
  const locale = typeof arg2 === "object" ? arg3 : arg2;
  return { route, params, locale, query: undefined };
}
