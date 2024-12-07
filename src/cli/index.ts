import { Command } from "commander";
import figlet from "figlet";
import { generate } from "./commands/generate";

export type { UserConfig as Config } from "./types";

// Make sure commands gracefully respect termination signals (e.g. from Docker)
process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));

const program = new Command("next-i18n-gen");

console.info(figlet.textSync("next-i18n-gen".toUpperCase(), "Small"));

program
  .command("generate", { isDefault: true })
  .summary("generate translated routes")
  .description("generate translated routes")
  .option(
    "-c, --config [path]",
    "custom path to a configuration file",
    "i18n.config.ts"
  )
  .action(generate);

program.parse();
