---
sidebar_position: 2
---

# Getting started

Let's suppose on the forecoming sections that we have an app with a simple routing structure:

```
├── app
│   ├── about
│   │   └── page.tsx
│   │── layout.tsx
│   │── page.tsx
│   └── api
│       └── ...
└── ...
```

The requirement is to localize the app for Finnish audience. The English pages should be served from the `/en`- and the Finnish pages from the `/fi`-prefixed paths. Also the path segments should be translated to improve the SEO of the site.

So the goal is to have the localized HTML pages served from the following paths:

- `/en`
- `/about`
- `/fi`
- `/fi/tietoa`

Let's see how we can make this happen with the NextGlobeGen-package.
