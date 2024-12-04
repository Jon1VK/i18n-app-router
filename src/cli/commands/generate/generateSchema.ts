import { readFileSync, writeFileSync } from "fs";
import path from "path";
import type { Config } from "~/cli";
import type { OriginRoute } from "~/cli/types";

const PACKAGE_DIST_DIR = "./node_modules/i18n-app-router/dist";

export function generateSchema(config: Config, originRoutes: OriginRoute[]) {
  const routes: Record<string, Record<string, string>> = {};
  originRoutes.forEach((originRoute) => {
    if (originRoute.type !== "page") return;
    const routeName = getRouteName(originRoute.path);
    routes[routeName] ||= {};
    config.locales.forEach((locale) => {
      const localizedPath = originRoute.localizedPaths[locale];
      const routePath = getRoutePath(localizedPath);
      routes[routeName][locale] = routePath;
    });
  });
  const schema = {
    locales: config.locales,
    defaultLocale: config.defaultLocale,
    routes,
  };
  const routerTemplatePath = path.join(PACKAGE_DIST_DIR, "routerTemplate.js");
  const routerTemplate = readFileSync(routerTemplatePath).toString();
  const JSONSchema = JSON.stringify(schema, null, "\t");
  const updatedRouterFile = routerTemplate.replace('"{{schema}}"', JSONSchema);
  const routerPath = path.join(PACKAGE_DIST_DIR, "router.js");
  writeFileSync(routerPath, updatedRouterFile);
  return schema;
}

function getRouteName(originPath: string) {
  return [
    removePageSegment,
    removeGroupSegments,
    removeParallelSegments,
    removeInterceptedSegments,
    asRootPath,
  ].reduce((result, next) => next(result), originPath);
}

function getRoutePath(localizedPath: string) {
  return [
    removePageSegment,
    removeGroupSegments,
    removeParallelSegments,
    removeInterceptedSegments,
    formatDynamicSegments,
    asRootPath,
  ].reduce((result, next) => next(result), localizedPath);
}

function removePageSegment(input: string) {
  return input.replace(/\/page\.([tj])sx?$/, "");
}

function removeGroupSegments(input: string) {
  return input.replace(/\/\([\w-]+\)/g, "");
}

function removeParallelSegments(input: string) {
  return input.replace(/\/@\w+/g, "");
}

function removeInterceptedSegments(input: string) {
  let result = input.replace(/\(\.\)/g, "");
  const twoDotsRegExp = /[[\w-\]]+\/\(\.{2}\)/g;
  while (twoDotsRegExp.test(result)) {
    result = result.replace(twoDotsRegExp, "");
  }
  return result.replace(/.*\(\.{3}\)/g, "/");
}

function formatDynamicSegments(input: string) {
  return input
    .replace(/\/\[\[\.\.\.(\w+)\]\]/g, "{/*$1}") // /[[...slug]] -> {/*slug}
    .replace(/\/\[\.\.\.(\w+)\]/g, "/*$1") // /[...slug] -> /*slug
    .replace(/\/\[(\w+)\]/g, "/:$1"); // /[slug] -> /:slug
}

function asRootPath(input: string) {
  return input.startsWith("/") ? input : `/${input}`;
}
