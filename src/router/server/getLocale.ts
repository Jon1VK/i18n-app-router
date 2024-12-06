import { cache } from "react";
import type { Locale } from "../shared/schema";

type LocaleStore = { locale: Locale };

function createLocaleStore(): LocaleStore {
  return { locale: "" };
}

const getLocaleCache = cache(createLocaleStore);

export function getLocale() {
  return getLocaleCache().locale;
}

export function setLocale(locale: Locale) {
  getLocaleCache().locale = locale;
}
