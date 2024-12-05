import { writeFileSync } from "fs";
import path from "path";
import { pathToRegexp } from "path-to-regexp";
import type { Schema } from "~/cli/types";
import { toUnionType } from "~/cli/utils/ts-utils";

const PACKAGE_DIST_DIR = "./node_modules/next-i18n-gen/dist";

type PatternKey = (typeof PATTERN_KEYS)[number];
const PATTERN_KEYS = [
  "locales",
  "routeNamesStatic",
  "routeNamesDynamic",
  "routeParams",
] as const;

const PATTERNS = Object.fromEntries(
  PATTERN_KEYS.map((key) => [key, `{{${key}}}`])
) as Record<PatternKey, string>;

const template = `export type RouteLocale = ${PATTERNS.locales};

export type RouteNameStatic = ${PATTERNS.routeNamesStatic};
export type RouteNameDynamic = ${PATTERNS.routeNamesDynamic};
export type RouteName = RouteNameStatic | RouteNameDynamic;

export type RouteParams<T extends RouteNameDynamic> = ${PATTERNS.routeParams};

export type Schema = { 
  locales: RouteLocale[];
  defaultLocale: RouteLocale;
  routes: Record<RouteName, Record<RouteLocale, string>>;
};

export const schema: Schema;

export function getHref<T extends RouteNameStatic>(routeName: T, locale: RouteLocale): string;
export function getHref<T extends RouteNameDynamic>(routeName: T, locale: RouteLocale, params: RouteParams<T>): string;
`;

export function generateTypes(schema: Schema) {
  let content = template;
  const routeNames = Object.keys(schema.routes);
  const staticRouteNames = routeNames.filter(isStaticRoute);
  const dynamicRouteNames = routeNames.filter(isDynamicRoute);
  const templateParams: Record<PatternKey, string> = {
    locales: toUnionType(schema.locales),
    routeNamesStatic: toUnionType(staticRouteNames),
    routeNamesDynamic: toUnionType(dynamicRouteNames),
    routeParams: toRouteParamsType(schema, dynamicRouteNames),
  };
  PATTERN_KEYS.forEach((key) => {
    content = content.replaceAll(PATTERNS[key], templateParams[key]);
  });
  const typesPath = path.join(PACKAGE_DIST_DIR, "router.d.ts");
  writeFileSync(typesPath, content);
}

function isStaticRoute(routeName: string) {
  return !isDynamicRoute(routeName);
}

function isDynamicRoute(routeName: string) {
  return /\[\.{0,3}\w+\]/.test(routeName);
}

function isCatchAllRoute(routeName: string) {
  return /\[\.{3}\w+\]/.test(routeName);
}

function isOptionalCatchAllRoute(routeName: string) {
  return /\[{2}\.{3}\w+\]{2}/.test(routeName);
}

function toRouteParamsType(schema: Schema, dynamicRouteNames: string[]) {
  if (dynamicRouteNames.length === 0) return "never";
  return "\n\t".concat(
    dynamicRouteNames
      .map((routeName) => {
        const path = schema.routes[routeName][schema.defaultLocale];
        const result = pathToRegexp(path);
        const keys = result.keys;
        const divider = isOptionalCatchAllRoute(routeName) ? "?: " : ": ";
        const type = isCatchAllRoute(routeName) ? "string[]" : "string";
        const routeParams = keys
          .map((key) => `${key.name}${divider}${type}`)
          .join("; ");
        return `T extends "${routeName}"\n\t? { ${routeParams} }`;
      })
      .join("\n\t: ")
      .concat("\n\t: never")
  );
}
