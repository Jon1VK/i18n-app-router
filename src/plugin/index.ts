import type { NextConfig } from "next";
import { spawn } from "node:child_process";
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
    spawn(`npx next-globe-gen --watch --config ${configPath}`, {
      cwd: process.cwd(),
      stdio: "inherit",
      shell: true,
      detached: false,
    });
  } catch (_e) {
    console.error("Failed to spawn the NextGlobeGen compiler process");
  }
}
