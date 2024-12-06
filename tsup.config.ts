import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    cli: "src/cli/index.ts",
    routerTemplate: "src/router/index.ts",
    router: "src/router/index.ts",
  },
  clean: true,
  dts: true,
});
