---
sidebar_position: 1
---

# Installation

Install the package by running:

```bash
npm install next-globe-gen
```

Create an `i18n.config.ts`-file to the application root directory and export your configuration as a default export.

```ts
// ./i18n.config.ts

import type { Config } from "next-globe-gen";

const config: Config = {
  locales: ["en", "fi"],
  defaultLocale: "en",
  // DEFAULTS:
  // prefixDefaultLocale: true,
  // originDir: "./_app",
  // localizedDir: "./app/(i18n)",
};

export default config;
```
