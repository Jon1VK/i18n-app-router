"use client";

import { createContext, use, type ReactNode } from "react";
import type { RouteLocale } from "../shared/schema";

const LocaleContext = createContext<{ locale: RouteLocale }>({ locale: "" });

export default function LocaleProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: RouteLocale;
}) {
  return (
    <LocaleContext.Provider value={{ locale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => use(LocaleContext).locale;
