import path from "path";
import type { Config, UserConfig } from "~/cli/types";
import { isDirectory, isFile } from "~/cli/utils/fs-utils";
import { compile, removeCompiledFiles } from "~/cli/utils/ts-utils";
import { configNotFoundError, originDirNotFoundError } from "./errors";
import { generateDistFiles } from "./generateDistFiles";
import { generateLocalizedRoutes } from "./generateLocalizedRoutes";
import { getMessages } from "./getMessages";
import { getOriginRoutes } from "./getOriginRoutes";

export const DEFAULT_CONFIG: Config = {
  originDir: "./src/_app",
  localizedDir: "./src/app/(i18n)",
  locales: [],
  defaultLocale: "",
  prefixDefaultLocale: true,
  getMessages(locale) {
    const filePath = path.join(process.cwd(), `./src/messages/${locale}.json`);
    return require(filePath);
  },
};

export async function generate(args: { config: string }) {
  try {
    const startTime = process.hrtime();
    if (!isFile(args.config)) throw configNotFoundError(args.config);
    const userConfig = await compile<{ default: UserConfig }>(args.config);
    const config = { ...DEFAULT_CONFIG, ...userConfig.default };
    if (!isDirectory(config.originDir)) throw originDirNotFoundError(config);
    const originRoutes = await getOriginRoutes({ config });
    const messages = await getMessages(config);
    generateLocalizedRoutes(config, originRoutes);
    generateDistFiles(config, originRoutes, messages);
    const endTime = process.hrtime(startTime);
    const timeDiffInMs = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2);
    console.info(
      `\x1b[32mNextGlobeGen\x1b[37m - Localized ${originRoutes.length} files in ${timeDiffInMs}ms`
    );
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  } finally {
    removeCompiledFiles();
  }
}
