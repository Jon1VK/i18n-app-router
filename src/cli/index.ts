import { Command } from "commander";
import figlet from "figlet";
import { generate } from "./commands/generate";

export type { UserConfig as Config } from "./types";

// Make sure commands gracefully respect termination signals (e.g. from Docker)
process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));

const program = new Command("NextGlobeGen");

console.info(figlet.textSync("NextGlobeGen".toUpperCase(), "Small"));

program
  .command("generate", { isDefault: true })
  .summary("generate localized routes")
  .description("generate localizes routes")
  .option(
    "-c, --config [path]",
    "custom path to a configuration file",
    "i18n.config.ts"
  )
  .action(generate);

program.parse();
