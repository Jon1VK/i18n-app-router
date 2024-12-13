"use client";

import { createContext, use, type ReactNode } from "react";
import type { Messages } from "../shared/messages";
import type { Locale } from "../shared/schema";

const IntlContext = createContext<{ locale: Locale; messages: Messages }>({
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

export const useLocale = () => use(IntlContext).locale;
export const useMessages = () => use(IntlContext).messages;
