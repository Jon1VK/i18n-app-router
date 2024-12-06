import { cache } from "react";
import { RouterError } from "../shared/errors";
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
  const localeStore = getLocaleStore();
  if (localeStore.locale === "") return (localeStore.locale = locale);
  throw new RouterError("setLocale should not be called by the user");
}
