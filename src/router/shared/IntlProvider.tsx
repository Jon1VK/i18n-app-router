"use client";

import { createContext, type ReactNode } from "react";
import type { Messages } from "./messages";
import type { Locale } from "./schema";

export const IntlContext = createContext<{
  locale: Locale;
  messages: Messages;
}>({
  locale: "",
  messages: {},
});

type IntlProviderProps = {
  children: ReactNode;
  locale: Locale;
  messages: Messages;
};

export function IntlProvider({
  children,
  locale,
  messages,
}: IntlProviderProps) {
  return (
    <IntlContext.Provider value={{ locale, messages }}>
      {children}
    </IntlContext.Provider>
  );
}
