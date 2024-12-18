import type { NextConfig } from "next";
import { spawn } from "node:child_process";
import { addAliases } from "./addAliases";

export function withNextGlobeGenPlugin(configPath = "./i18n.config.ts") {
  if (!process.env.NEXT_PRIVATE_WORKER) useGenerator(configPath);
  return function withNextGlobeGen(config: NextConfig) {
    addAliases(config, {
      "next-globe-gen/schema": "./.next-globe-gen/schema.ts",
      "next-globe-gen/messages": "./.next-globe-gen/messages.ts",
    });
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
