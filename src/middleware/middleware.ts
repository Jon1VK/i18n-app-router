import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { schema, type Locale } from "next-globe-gen/schema";
import { NextResponse, type NextRequest } from "next/server";
import { compile, match as pathMatcher } from "path-to-regexp";

export function middleware(request: NextRequest) {
  const [locale_, pathname] = getLocaleAndPathname(request.nextUrl.pathname);
  let locale = locale_;

  // Redirect to nonprefixed URL if default locale is not wanted
  if (!schema.prefixDefaultLocale && locale === schema.defaultLocale) {
    return NextResponse.redirect(new URL(pathname, request.url));
  }

  // Redirect to locale prefixed URL
  if (schema.prefixDefaultLocale && !locale) {
    const matchedLocale = localeMatcher(request);
    return NextResponse.redirect(
      new URL(`/${matchedLocale}${pathname}`, request.url)
    );
  }

  // It there is no locale at this point, we have to be on default locale site
  if (!locale) locale = schema.defaultLocale;

  // Apply alternative localized links
  const response = NextResponse.next();
  const alternativeLinks = getAlternativeLinks(locale, pathname);
  if (!alternativeLinks) return response;

  const linkHeader = alternativeLinks
    .map(({ locale, alternate }) => {
      const url = new URL(alternate, request.url);
      url.search = "";
      return `<${url}>; rel="alternate"; hreflang="${locale}"`;
    })
    .join(", ");
  response.headers.set("Link", linkHeader);

  return response;
}

function getLocaleAndPathname(pathname: string) {
  const regexp = new RegExp(`\\/(${schema.locales.join("|")})(\\/?.*)`);
  const match = pathname.match(regexp);
  if (!match) return [undefined, pathname] as const;
  return [match[1] as Locale, match[2] || "/"] as const;
}

function localeMatcher(request: NextRequest) {
  const headers = Object.fromEntries(request.headers);
  const negotiator = new Negotiator({ headers });
  return match(negotiator.languages(), schema.locales, schema.defaultLocale);
}

function getAlternativeLinks(locale: Locale, pathname: string) {
  let params: Partial<Record<string, string | string[]>>;
  const localizedPaths = Object.values(schema.routes).find((localizedPaths) => {
    const match = pathMatcher(localizedPaths[locale]!)(pathname);
    if (!match) return false;
    params = match.params;
    return true;
  });
  if (!localizedPaths) return undefined;
  return schema.locales.map((locale) => ({
    locale,
    alternate: compile(localizedPaths[locale]!)(params),
  }));
}
