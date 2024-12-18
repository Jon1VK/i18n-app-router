---
sidebar_position: 2
---

# Getting started

Let's see how you can use the NextGlobeGen package to setup i18n for your Next.js app.

If you haven’t done so already, [create new a Next.js app](https://nextjs.org/docs/app/getting-started/installation) that uses the App Router.

## Installation

Install the package by running:

```
npm install next-globe-gen
```

## Setup

Create the following file structure, which the package assumes is present by default. The default directory and file locations can be altered by configuration, but let's use the defaults for now.

```treeview
.
├── i18n.config.ts 1)
├── next.config.ts 1)
├── messages/ 2)
│   ├── en.json
│   └── <locale>.json
└── src/
    ├── _app/ 3)
    │   ├── layout.tsx
    │   └── page.tsx
    ├── app/
    └── middleware.ts 4)
```

### <span style={{ color: "#addb67"}}>1)</span> Configuration

Create an `i18n.config.ts`-file to the application root directory and export your configuration as a default export. You have to at least configure what locales the application supports and what is the default locale.

```ts
// ./i18n.config.ts

import type { Config } from "next-globe-gen";

const config: Config = {
  locales: ["en", <locale>],
  defaultLocale: "en",
};

export default config;
```

In addition to creating the `i18n.config.ts`-configuration file, you need to enable the NextGlobeGen plugin in the `next.config.ts` file.

```ts
// ./next.config.ts

import type { NextConfig } from "next";
import { withNextGlobeGenPlugin } from "next-globe-gen/plugin";

const withNextGlobeGen = withNextGlobeGenPlugin();

const nextConfig: NextConfig = {
  /* Next.js config options here */
};

export default withNextGlobeGen(nextConfig);
```

### <span style={{ color: "#addb67"}}>2)</span> Messages

Create message translation JSON files to the `messages`-directory. There should be one `<locale>.json`-file for each configured `locale`.

```json
// ./messages/en.json

{
  "hello": "Hello {name}"
}
```

### <span style={{ color: "#addb67"}}>3)</span> Routing

Create your Next.js file-system based routing into the `_app`-directory exactly the same way as you would in the `app` directory. You can use the NextGlobeGen package APIs to get the current locale and translations.

```tsx
// ./src/_app/layout.tsx

import { useLocale } from "next-globe-gen";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const locale = useLocale();
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// ./src/_app/page.tsx

import { useTranslations } from "next-globe-gen";

export default function Home() {
  const t = useTranslations();
  return (
    <main>
      <h1>{t("hello", { name: "NextGlobeGen" })}</h1>
    </main>
  );
}
```

### <span style={{ color: "#addb67"}}>4)</span> Middleware

Add middleware to the application by exporting NextGlobeGen `middleware` from `middleware.ts` file. The middleware handles locale negotiation and redirects to locale-prefixed path if the path has no locale yet.

```tsx
// ./src/middleware.ts

export { middleware } from "next-globe-gen/middleware";

export const config = {
  // Matcher ignoring next internals and static assets
  matcher: ["/((?!_next|.*\\.).*)"],
};
```

## Running the App

After the setup has been done, start the Next.js development server and enjoy the seamless internationalization experience.

```
npm run dev
```

You should be greeted with the following lines:

```
NextGlobeGen - Localized 3 files in 4.17ms
NextGlobeGen - Generated messages in 0.05ms
```

The NextGlobeGen plugin generated required files for the app so that the routes can be served in the configured locales. For example the file structure in the `app`-directory updates to the following:

```treeview
src/
└── app/
    └── (i18n)/
        ├── en/
        │   ├── layout.tsx
        │   └── page.tsx
        └── <locale>/
            ├── layout.tsx
            └── page.tsx
```

Next.js uses now these routes as it's source for file-based routing. You can also inspect what each generated file includes in the `./src/app/(i18n)`-directory.
