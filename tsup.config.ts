import { defineConfig } from "tsup";

export default defineConfig([
  {
    clean: true,
    minify: true,
    entry: {
      cli: "src/cli/index.ts",
      middleware: "src/middleware/index.ts",
      "index.server.template": "src/router/server/index.ts",
      "index.server": "src/router/server/index.ts",
    },
    dts: {
      entry: {
        cli: "src/cli/index.ts",
        middleware: "src/middleware/index.ts",
      },
    },
  },
  {
    clean: true,
    minify: true,
    esbuildOptions(options) {
      options.banner = { js: '"use client"' };
    },
    entry: {
      "index.client.template": "src/router/client/index.ts",
      "index.client": "src/router/client/index.ts",
    },
    dts: {
      entry: {
        "index.client.template": "src/router/client/index.ts",
        "index.client": "src/router/client/index.ts",
      },
    },
  },
]);
