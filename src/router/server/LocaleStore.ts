import { cache } from "react";
import type { Locale } from "../shared/schema";

type LocaleStore = { locale: Locale };

function createLocaleStore(): LocaleStore {
  return { locale: "" };
}

const getLocaleStore = cache(createLocaleStore);

export function useLocale() {
  return getLocaleStore().locale;
}

export function setLocale(locale: Locale) {
  getLocaleStore().locale = locale;
}
