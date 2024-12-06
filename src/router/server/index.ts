import { LinkFactory } from "../shared/LinkFactory";
import { useHrefFactory } from "../shared/useHrefFactory";
import { useLocale } from "./LocaleStore";

export * from "./LocaleStore";
export * from "./redirect";

export const useHref = useHrefFactory(useLocale);
export const Link = LinkFactory(useHref);
