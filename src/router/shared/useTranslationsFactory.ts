import IntlMessageFormat from "intl-messageformat";
import type { Messages, Namespace, NamespaceKey } from "./messages";
import type { Locale } from "./schema";

export function useTranslationsFactory(
  useLocale: () => Locale,
  useMessages: () => Messages
) {
  return function useTranslations<N extends Namespace | undefined>(
    namespace?: N
  ) {
    return function t<K extends NamespaceKey<N>>(key: K, params?: any) {
      const locale = useLocale();
      const messages = useMessages();
      const fullKey = `${namespace}.${key}` as keyof Messages[Locale];
      const message = messages[locale]?.[fullKey];
      if (!message) return fullKey;
      const msgFormat = new IntlMessageFormat(message, locale);
      return msgFormat.format(params);
    };
  };
}
