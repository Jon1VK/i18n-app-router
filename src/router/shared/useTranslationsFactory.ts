import IntlMessageFormat from "intl-messageformat";
import type {
  Message,
  MessageArguments,
  MessageKey,
  Messages,
  Namespace,
  NamespaceKey,
} from "./messages";
import type { DefaultLocale, Locale } from "./schema";

export function useTranslationsFactory(
  useLocale: () => Locale,
  useMessages: () => Messages
) {
  return function useTranslations<N extends Namespace>(namespace?: N) {
    return function t<
      K extends NamespaceKey<N>,
      A extends MessageArguments<Message<N, K>> = MessageArguments<
        Message<N, K>
      >,
    >(
      ...params: A extends Record<string, never>
        ? [key: K, args?: undefined]
        : [key: K, args: A]
    ) {
      const [key, args] = params;
      const locale = useLocale() as DefaultLocale;
      const messages = useMessages();
      const fullKey = (namespace ? `${namespace}.${key}` : key) as MessageKey;
      const message = messages[locale]?.[fullKey];
      if (!message) return fullKey;
      const msgFormat = new IntlMessageFormat(message, locale);
      return msgFormat.format(args) as string;
    };
  };
}
