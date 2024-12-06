import type {
  AppRouterInstance,
  NavigateOptions,
  PrefetchOptions,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter as useNextRouter } from "next/navigation";
import { useHref } from ".";
import type { Route } from "../shared/schema";
import {
  type UseHrefArgs,
  extractUseHrefOptions,
} from "../shared/useHrefFactory";

export function useRouter() {
  const router = useNextRouter();

  function push<R extends Route>(...args: UseHrefArgs<R>) {
    const useHrefOptions = extractUseHrefOptions(args);
    return router.push(useHref(useHrefOptions));
  }
  push.opts = (opts: NavigateOptions) => {
    return function pushWithOptions<R extends Route>(...args: UseHrefArgs<R>) {
      const useHrefOptions = extractUseHrefOptions(args);
      return router.push(useHref(useHrefOptions), opts);
    };
  };

  function replace<R extends Route>(...args: UseHrefArgs<R>) {
    const useHrefOptions = extractUseHrefOptions(args);
    return router.replace(useHref(useHrefOptions));
  }
  replace.opts = (opts: NavigateOptions) => {
    return function replaceWithOptions<R extends Route>(
      ...args: UseHrefArgs<R>
    ) {
      const useHrefOptions = extractUseHrefOptions(args);
      return router.replace(useHref(useHrefOptions), opts);
    };
  };

  function prefetch<R extends Route>(...args: UseHrefArgs<R>) {
    const useHrefOptions = extractUseHrefOptions(args);
    return router.prefetch(useHref(useHrefOptions));
  }
  prefetch.opts = (opts: PrefetchOptions) => {
    return function prefetchWithOptions<R extends Route>(
      ...args: UseHrefArgs<R>
    ) {
      const useHrefOptions = extractUseHrefOptions(args);
      return router.prefetch(useHref(useHrefOptions), opts);
    };
  };

  return {
    back: router.back,
    forward: router.forward,
    refresh: router.refresh,
    push,
    replace,
    prefetch,
  } satisfies Record<keyof AppRouterInstance, Function>;
}
