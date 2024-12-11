import type { Config, UserConfig } from "~/cli/types";
import { compile, removeCompiledFiles } from "~/cli/utils/ts-utils";
import { generateLocalizedRoutes } from "./generateLocalizedRoutes";
import { generateSchema } from "./generateSchema";
import { getOriginRoutes } from "./getOriginRoutes";

export const DEFAULT_CONFIG: Config = {
  originDir: "./_app",
  localizedDir: "./app/(i18n)",
  locales: [],
  defaultLocale: "",
  prefixDefaultLocale: true,
};

export async function generate(args: { config: string }) {
  try {
    const startTime = process.hrtime();
    const userConfig = await compile<{ default: UserConfig }>(args.config);
    const config = { ...DEFAULT_CONFIG, ...userConfig.default };
    const originRoutes = await getOriginRoutes({ config });
    generateLocalizedRoutes(config, originRoutes);
    generateSchema(config, originRoutes);
    const endTime = process.hrtime(startTime);
    const timeDiffInMs = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2);
    console.info(
      `\x1b[32mNextGlobeGen\x1b[37m - Localized ${originRoutes.length} files in ${timeDiffInMs}ms`
    );
  } catch (error) {
    console.error(error);
  } finally {
    removeCompiledFiles();
  }
}
