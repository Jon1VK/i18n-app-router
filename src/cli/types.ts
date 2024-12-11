import type { RouteType } from "./commands/generate/getOriginRoutes";

export type Config<L extends string[] = string[]> = {
  originDir: string;
  localizedDir: string;
  locales: L;
  defaultLocale: L[number];
  prefixDefaultLocale: boolean;
};

type RequiredUserConfigKeys = "locales" | "defaultLocale";

export type UserConfig = Pick<Config, RequiredUserConfigKeys> &
  Partial<Omit<Config, RequiredUserConfigKeys>>;

export type OriginRoute = {
  type: RouteType;
  path: string;
  localizedPaths: Record<string, string>;
};

export type Schema = {
  locales: string[];
  defaultLocale: string;
  routes: Record<string, Record<string, string>>;
};
