import { writeFileSync } from "fs";
import path from "path";
import type { Config, OriginRoute } from "~/cli/types";
import { makeDirectory } from "~/cli/utils/fs-utils";
import { toPascalCase } from "~/cli/utils/string-utils";
import type { Messages } from "./getMessages";

const OUT_DIR = "./.next-globe-gen";

const template = (type: "schema" | "messages") => {
  return `export const ${type} = {${type}} as const;\n`;
};

export const typesFile = ["schema", "messages"]
  .map((type) =>
    "".concat(
      `import { ${type} } from "./${type}";\n\n`,
      `declare module "next-globe-gen" {\n`,
      `\tinterface ${toPascalCase(type)}Register {\n`,
      `\t\t${type}: typeof ${type}\n\t}\n}\n`
    )
  )
  .join("\n");

export function generateDistFiles(
  config: Config,
  originRoutes: OriginRoute[],
  messages: Messages
) {
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
  const JSONSchema = JSON.stringify(schema);
  const JSONMessages = JSON.stringify(messages);
  const schemaFile = template("schema").replaceAll("{schema}", JSONSchema);
  const messagesFile = template("messages").replaceAll(
    "{messages}",
    JSONMessages
  );
  const schemaFilePath = path.join(OUT_DIR, "schema.ts");
  const messagesFilePath = path.join(OUT_DIR, "messages.ts");
  const typesFilePath = path.join(OUT_DIR, "types.d.ts");
  makeDirectory(OUT_DIR);
  writeFileSync(schemaFilePath, schemaFile);
  writeFileSync(messagesFilePath, messagesFile);
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
