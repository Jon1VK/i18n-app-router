import IntlMessageFormat from "intl-messageformat";
import type {
  Message,
  MessageArguments,
  MessageKey,
  Messages,
  Namespace,
  NamespaceKey,
} from "next-globe-gen/messages";
import type { Locale } from "next-globe-gen/schema";

export function useTranslationsFactory(
  useLocale: () => Locale,
  useMessages: () => Messages
) {
  return function useTranslations<N extends Namespace>(opts?: {
    namespace?: N;
    locale?: Locale;
  }) {
    const locale = opts?.locale ?? useLocale();
    const namespace = opts?.namespace;
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
      const messages = useMessages();
      const fullKey = (namespace ? `${namespace}.${key}` : key) as MessageKey;
      const message = messages[locale]?.[fullKey];
      if (!message) return fullKey;
      const msgFormat = new IntlMessageFormat(message, locale);
      return msgFormat.format(args) as string;
    };
  };
}
