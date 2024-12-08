import { readFileSync, writeFileSync } from "fs";
import path from "path";
import type { Config, OriginRoute } from "~/cli/types";

const DIST_DIR = "./node_modules/next-globe-gen/dist";

export function generateSchema(config: Config, originRoutes: OriginRoute[]) {
  const routes: Record<string, Record<string, string>> = {};
  originRoutes.forEach((originRoute) => {
    if (!isPageOriginRoute(originRoute)) return;
    const routeName = getRouteName(originRoute.path);
    routes[routeName] ||= {};
    Object.entries(originRoute.localizedPaths).forEach(
      ([locale, localizedPath]) => {
        const routePath = getRoutePath(localizedPath);
        routes[routeName]![locale] = routePath;
      }
    );
  });
  const schema = {
    locales: config.locales,
    defaultLocale: config.defaultLocale,
    prefixDefaultLocale: config.prefixDefaultLocale,
    routes,
  };
  const clientTemplatePath = path.join(DIST_DIR, "index.client.template.js");
  const serverTemplatePath = path.join(DIST_DIR, "index.server.template.js");
  const typesTemplatePath = path.join(DIST_DIR, "index.client.template.d.ts");
  const clientTemplate = readFileSync(clientTemplatePath).toString();
  const serverTemplate = readFileSync(serverTemplatePath).toString();
  const typesTemplate = readFileSync(typesTemplatePath).toString();
  const JSONSchema = JSON.stringify(schema);
  const clientFile = clientTemplate.replace('"{{schema}}"', JSONSchema);
  const serverFile = serverTemplate.replace('"{{schema}}"', JSONSchema);
  const typesFile = typesTemplate.replace("MockSchema;", `${JSONSchema};`);
  const clientFilePath = path.join(DIST_DIR, "index.client.js");
  const serverFilePath = path.join(DIST_DIR, "index.server.js");
  const typesFilePath = path.join(DIST_DIR, "index.client.d.ts");
  writeFileSync(clientFilePath, clientFile);
  writeFileSync(serverFilePath, serverFile);
  writeFileSync(typesFilePath, typesFile);
}

function isPageOriginRoute(originRoute: OriginRoute) {
  return (
    originRoute.type === "page" ||
    (originRoute.type === "copy" && /page\.[^.]*\.mdx?$/.test(originRoute.path))
  );
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
  return input.replace(/\/page(\.[^.]+)?\.(js|ts|md)x?$/, "");
}

function removeGroupSegments(input: string) {
  return input.replace(/\/\([^)/]+\)/g, "");
}

function removeParallelSegments(input: string) {
  return input.replace(/\/@[^/]+/g, "");
}

function removeInterceptedSegments(input: string) {
  let result = input.replace(/\(\.\)/g, "");
  const twoDotsRegExp = /[^/]+\/\(\.{2}\)/g;
  while (twoDotsRegExp.test(result)) {
    result = result.replace(twoDotsRegExp, "");
  }
  return result.replace(/.*\(\.{3}\)/g, "/");
}

function formatDynamicSegments(input: string) {
  return input
    .replace(/\/\[{2}\.{3}([^\]]+)\]{2}/g, "{/*$1}") // /[[...slug]] -> {/*slug}
    .replace(/\/\[\.{3}([^\]]+)\]/g, "/*$1") // /[...slug] -> /*slug
    .replace(/\/\[([^\]]+)\]/g, "/:$1"); // /[slug] -> /:slug
}

function asRootPath(input: string) {
  return input.startsWith("/") ? input : `/${input}`;
}
