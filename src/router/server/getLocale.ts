import { cache } from "react";
import type { RouteLocale } from "../shared/schema";

type LocaleStore = { locale: RouteLocale };

function createLocaleStore(): LocaleStore {
  return { locale: "" };
}

const getLocaleCache = cache(createLocaleStore);

export function getLocale() {
  return getLocaleCache().locale;
}

export function setLocale(locale: RouteLocale) {
  getLocaleCache().locale = locale;
}
