import { useHrefFactory } from "../shared/useHrefFactory";
import { useLocale } from "./LocaleProvider";

export type * from "../shared/schema";
export * from "./LocaleProvider";

export const useHref = useHrefFactory(useLocale);
