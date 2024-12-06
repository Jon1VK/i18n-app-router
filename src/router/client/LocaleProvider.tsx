"use client";

import { createContext, use, type ReactNode } from "react";
import type { Locale } from "../shared/schema";

const LocaleContext = createContext<{ locale: Locale }>({ locale: "" });

export default function LocaleProvider({
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
