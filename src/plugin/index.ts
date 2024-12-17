import type { NextConfig } from "next";
import { spawnSync } from "node:child_process";
import { addAlias } from "./addAlias";

export function withNextGlobeGenPlugin(configPath = "./i18n.config.ts") {
  if (!process.env.NEXT_PRIVATE_WORKER) useGenerator(configPath);
  return function withNextGlobeGen(config: NextConfig) {
    addAlias(config, { "next-globe-gen/config": configPath });
    return config;
  };
}

function useGenerator(configPath: string) {
  try {
    spawnSync(`npx next-globe-gen --config ${configPath}`, {
      cwd: process.cwd(),
      stdio: "inherit",
      shell: true,
    });
  } catch (_e) {
    console.error("Failed to spawn the NextGlobeGen compiler process");
  }
}
