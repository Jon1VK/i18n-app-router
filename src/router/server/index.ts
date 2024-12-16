import { LinkFactory } from "../shared/LinkFactory";
import { messages } from "../shared/messages";
import { useHrefFactory } from "../shared/useHrefFactory";
import { useTranslationsFactory } from "../shared/useTranslationsFactory";
import { useLocale } from "./LocaleStore";

export * from "../shared/schema";
export * from "./LocaleStore";
export * from "./redirect";

export const useHref = useHrefFactory(useLocale);
export const Link = LinkFactory(useHref);
export const useMessages = () => messages;
export const useTranslations = useTranslationsFactory(useLocale, useMessages);
