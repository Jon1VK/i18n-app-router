import { LinkFactory } from "../shared/LinkFactory";
import { useHrefFactory } from "../shared/useHrefFactory";
import { useLocale } from "./LocaleProvider";
import { notSupported } from "./notSupported";

export type * from "../shared/schema";
export * from "./LocaleProvider";
export * from "./useRouter";

export const useHref = useHrefFactory(useLocale);
export const Link = LinkFactory(useHref);
export const redirect = notSupported("redirect");
export const permanentRedirect = notSupported("permanentRedirect");
