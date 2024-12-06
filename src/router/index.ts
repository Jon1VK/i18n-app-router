import { CliError } from "./errors";
import { schema } from "./schema";

export { getHref } from "./getHref";
export { getLocale } from "./getLocale";
export {
  schema,
  type DynamicRoute,
  type Route,
  type RouteLocale,
  type RouteParams,
  type StaticRoute,
} from "./schema";

if (typeof schema === "string") {
  throw new CliError("Router schema for next-i18n-gen has not been generated");
}
