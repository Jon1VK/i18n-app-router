import { CliError } from "./shared/errors";
import { schema } from "./shared/schema";

export * from "./client";
export * from "./server";
export * from "./shared";

if (typeof schema === "string") {
  throw new CliError("Router schema for next-i18n-gen has not been generated");
}
