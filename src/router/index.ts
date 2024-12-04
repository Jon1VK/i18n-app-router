import { compile } from "path-to-regexp";

type Schema = {
  locales: string[];
  defaultLocale: string;
  routes: Record<string, Record<string, string>>;
};

export const schema = "{{schema}}" as unknown as Schema;

export function getHref(
  routeName: string,
  locale: string,
  params: Partial<Record<string, string | string[]>>
) {
  const path = schema.routes[routeName][locale];
  const compiler = compile(path);
  return compiler(params);
}
