import { copyFileSync, writeFileSync } from "fs";
import path from "path";
import type { Config, OriginRoute } from "~/cli/types";
import { makeDirectory, rmDirectory } from "~/cli/utils/fs-utils";
import { toPascalCase } from "~/cli/utils/string-utils";
import { getTemplateCompiler } from "./getTemplateCompiler";

export function generateLocalizedRoutes(
  config: Config,
  originRoutes: OriginRoute[]
) {
  const compile = compilerFactory(config);
  originRoutes.forEach(compile);
}

function compilerFactory(config: Config) {
  rmDirectory(config.localizedDir);
  return function compile(originRoute: OriginRoute) {
    const originPath = path.join(config.originDir, originRoute.path);
    const originPathDir = path.dirname(originPath);
    const compileTemplate = getTemplateCompiler(config, originRoute);
    config.locales.forEach((locale) => {
      const localizedRoutePath = originRoute.localizedPaths[locale]!;
      const localizedPath = path.join(config.localizedDir, localizedRoutePath);
      const localizedPathDir = path.dirname(localizedPath);
      makeDirectory(localizedPathDir);
      if (originRoute.type === "copy") {
        return copyFileSync(originPath, localizedPath);
      }
      const relativeDirPath = path.relative(localizedPathDir, originPathDir);
      const relativePath = path.join(relativeDirPath, originRoute.type);
      const compiledContents = compileTemplate({
        routeType: toPascalCase(originRoute.type),
        relativePath,
        locale,
      });
      writeFileSync(localizedPath, compiledContents);
    });
  };
}
