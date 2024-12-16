import { createHash } from "crypto";
import path from "path";
import { build } from "tsup";
import { rmDirectory } from "./fs-utils";

const OUT_DIR = "./node_modules/next-globe-gen/dist/tmp";

export async function compile<T>(filePath: string) {
  const outputFileName = createHash("md5").update(filePath).digest("hex");
  await build({
    config: false,
    target: "node18",
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
