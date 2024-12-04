import type { RouteType } from "./commands/generate/getOriginRoutes";

export type Config = {
  originDir: string;
  localizedDir: string;
  locales: string[];
  defaultLocale: string;
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
