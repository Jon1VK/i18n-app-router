import { CliError } from "./errors";

type MockSchema = {
  locales: string[];
  defaultLocale: string;
  prefixDefaultLocale: boolean;
  routes: Record<string, Record<string, string>>;
};

export const schema = "{{schema}}" as unknown as MockSchema;

if (typeof schema === "string") {
  throw new CliError("Router schema for next-globe-gen has not been generated");
}

type Schema = typeof schema;
export type Locale = Schema["locales"][number];
export type DefaultLocale = Schema["defaultLocale"];
export type Route = keyof Schema["routes"];

/**
 * Utility type for extracting all static routes
 */
type ExtractStaticRoutes<T extends Route> = T extends `${string}[${string}`
  ? never
  : T;

/**
 * All routes without dynamic parameters
 */
export type StaticRoute = ExtractStaticRoutes<Route>;

/**
 * All routes with dynamic parameters
 */
export type DynamicRoute = Exclude<Route, StaticRoute>;

/**
 * Utility type for extracting all possible route param keys
 */
type ExtractRouteParams<T extends Route> = T extends `${infer R}[[${infer P}]]`
  ? ExtractRouteParams<R> | P
  : T extends `${string}[${infer P}]${infer R}`
    ? P | ExtractRouteParams<R>
    : never;

/**
 * Get the params object type for a given route
 */
export type RouteParams<T extends Route> = {
  [K in ExtractRouteParams<T> as K extends `...${infer R}`
    ? R
    : K]: K extends `...${string}` ? string[] : string;
};
