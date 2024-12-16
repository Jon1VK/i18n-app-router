import { use } from "react";
import type {
  permanentRedirect as $permanentRedirect,
  redirect as $redirect,
} from "../server";
import { IntlContext } from "../shared/IntlProvider";
import { LinkFactory } from "../shared/LinkFactory";
import { useHrefFactory } from "../shared/useHrefFactory";
import { useTranslationsFactory } from "../shared/useTranslationsFactory";
import { notSupported } from "./notSupported";

export type { UserConfig as Config } from "../../cli/types";
export { IntlProvider } from "../shared/IntlProvider";
export * from "../shared/schema";
export * from "./useRouter";

export const useLocale = () => use(IntlContext).locale;
export const useMessages = () => use(IntlContext).messages;
export const useHref = useHrefFactory(useLocale);
export const Link = LinkFactory(useHref);
export const useTranslations = useTranslationsFactory(useLocale, useMessages);
export const redirect = notSupported("redirect") as unknown as typeof $redirect;
export const permanentRedirect = notSupported(
  "permanentRedirect"
) as unknown as typeof $permanentRedirect;
