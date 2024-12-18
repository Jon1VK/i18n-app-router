import { messages } from "next-globe-gen/messages";
import { LinkFactory } from "../shared/LinkFactory";
import { useHrefFactory } from "../shared/useHrefFactory";
import { useTranslationsFactory } from "../shared/useTranslationsFactory";
import { useLocale } from "./LocaleStore";

export * from "./LocaleStore";
export * from "./redirect";

export const useHref = useHrefFactory(useLocale);
export const Link = LinkFactory(useHref);
export const useMessages = () => messages;
export const useTranslations = useTranslationsFactory(useLocale, useMessages);
