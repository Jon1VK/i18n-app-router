import { useHrefFactory } from "../shared/useHrefFactory";
import { useLocale } from "./LocaleStore";

export * from "./LocaleStore";

export const useHref = useHrefFactory(useLocale);
