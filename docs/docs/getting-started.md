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

### <span style={{ color: "#addb67"}}>2)</span> Messages

Create message translation JSON files to the `messages`-directory. There should be one `<locale>.json`-file for each configured `locale`.

```json
// ./messages/en.json

{
  "hello": "Hello {name}"
}
```

### <span style={{ color: "#addb67"}}>3)</span> Routing

Create your Next.js file-system based routing into the `_app`-directory exactly the same way as you would in the `app` directory. Inside these files you can use the NextGlobeGen package APIs to get the current locale and translations.

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

## Running the Generator

After the setup has been done, run the following command to generate the locale-prefixed routes:

```
npx next-globe-gen
```

You should be greeted with the following text:

```
  _  _ _____  _______ ___ _    ___  ___ ___ ___ ___ _  _
 | \| | __\ \/ /_   _/ __| |  / _ \| _ ) __/ __| __| \| |
 | .` | _| >  <  | || (_ | |_| (_) | _ \ _| (_ | _|| .` |
 |_|\_|___/_/\_\ |_| \___|____\___/|___/___\___|___|_|\_|

NextGlobeGen - Localized 2 files in 74.53ms
```

After running the generator, the file structure in the `app`-directory updates to the following:

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

:::info

You have to run the generator again whenever you alter the routing structure or the message translation files.
