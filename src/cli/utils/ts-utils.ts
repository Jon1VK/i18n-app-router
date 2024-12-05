import { createHash } from "crypto";
import path from "path";
import { build } from "tsup";
import { rmDirectory } from "./fs-utils";

const OUT_DIR = "./node_modules/next-i18n-gen/dist/tmp";

export async function compile<T>(filePath: string) {
  const outputFileName = createHash("md5").update(filePath).digest("hex");
  await build({
    config: false,
    outDir: OUT_DIR,
    entryPoints: { [`${outputFileName}`]: filePath },
    silent: true,
  });
  const compiledPath = path.resolve(OUT_DIR, outputFileName);
  return require(compiledPath) as T;
}

export function removeCompiledFiles() {
  rmDirectory(OUT_DIR);
}

export function toUnionType(arr: string[]) {
  if (arr.length === 0) return "never";
  const separator = arr.length < 5 ? " | " : "\n\t| ";
  const prefix = arr.length < 5 ? "" : separator;
  return prefix.concat(arr.map((v) => `"${v}"`).join(separator));
}
