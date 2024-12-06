"use client";

import { createContext, use, type ReactNode } from "react";
import { setLocale as serverSetLocale } from "../server";
import type { Locale } from "../shared/schema";
import { notSupported } from "./notSupported";

const LocaleContext = createContext<{ locale: Locale }>({ locale: "" });

export function LocaleProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  return (
    <LocaleContext.Provider value={{ locale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => use(LocaleContext).locale;
export const setLocale = notSupported("setLocale") as typeof serverSetLocale;
