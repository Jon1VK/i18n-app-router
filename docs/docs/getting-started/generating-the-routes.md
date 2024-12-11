---
sidebar_position: 2
---

# Generating the Routes

Move your routes that need to be localized to your configured origin directory (`"./_app"` by default). Other routes should be kept in the app-directory.

```
├── _app
│   ├── about
│   │   └── page.tsx
│   │── layout.tsx
│   └── page.tsx
├── app
│   └── api
│       └── ...
└── ...
```

To generate the localized routes based on the given `i18n.config.ts`, run command:

```bash
npm next-globe-gen
```

After the CLI has generated the routes, the project structure should look like this:

```
├── _app
│   ├── about
│   │   ├── i18n.ts
│   │   └── page.tsx
│   │── layout.tsx
│   └── page.tsx
├── app
│   ├── (i18n)
│   │   ├── en
│   │   │   │── about
│   │   │   │   └── page.tsx
│   │   │   │── layout.tsx
│   │   │   └── page.tsx
│   │   ├── fi
│   │   │   │── about
│   │   │   │   └── page.tsx
│   │   │   │── layout.tsx
│   │   │   └── page.tsx
│   └── api
│       └── ...
└── ...
```

## Translating the Route Segments

To translate the route segments, create `i18n.ts`-files to the directories that correspond to those route segments that need to be translated.

> If you do not want to translate any route segments, then you can omit creating the `i18n.ts`-files altogether.

```
├── _app
│   ├── about
│   │   ├── i18n.ts
│   │   └── ...
│   └── ...
└── ...
```

Then you can either export a variable named `segmentTranslations` or an asynchronous function `generateSegmentTranslations` from the `i18n.ts`-files to translate the route segments.

```ts
// ./_app/about/i18n.ts

export const segmentTranslations = {
  // Directory name is used by default, if translation is omitted for some locale
  // en: "about",
  fi: "tietoa",
};

// Or use an async function to fetch the segment translations asynchronously
// export async function generateSegmentTranslations() {
//   return {
//     // en: "about",
//     fi: "tietoa",
//   };
// }
```

To generate the translated routes, run the generation command `npm next-globe-gen` again.

After the CLI has generated the routes, the project structure should look like this:

```
├── _app
│   ├── about
│   │   ├── i18n.ts
│   │   └── page.tsx
│   │── layout.tsx
│   └── page.tsx
├── app
│   ├── (i18n)
│   │   ├── en
│   │   │   │── about
│   │   │   │   └── page.tsx
│   │   │   │── layout.tsx
│   │   │   └── page.tsx
│   │   ├── fi
│   │   │   │── tietoa
│   │   │   │   └── page.tsx
│   │   │   │── layout.tsx
│   │   │   └── page.tsx
│   └── api
│       └── ...
└── ...
```

Finally our project is served on URLs that match perfectly the initial requirements. If you need to change your routes or translations, remember to run `npm next-globe-gen` again.

Next let's look at how we can translate the content by using the APIs provided by the package.
