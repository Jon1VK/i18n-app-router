import { RouterError } from "../shared/errors";

export function notSupported(functionName: string) {
  return () => {
    throw new RouterError(
      `\`${functionName}\` is not supported in Client Components.`
    );
  };
}
