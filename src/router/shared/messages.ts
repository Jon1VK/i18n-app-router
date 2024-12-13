import { CliError } from "./errors";
import type { Locale } from "./schema";

type MockMessages = Record<Locale, Record<string, string>>;

export const messages = "{{messages}}" as unknown as MockMessages;

if (typeof messages === "string") {
  throw new CliError(
    "The translated messages for next-globe-gen has not been generated"
  );
}

export type Messages = typeof messages;

type MessagesKey = keyof Messages[Locale];

type GetNamespaces<K extends MessagesKey> = K extends `${infer N}.${infer R}`
  ? N | GetNamespacesRecursion<R, N>
  : never;
type GetNamespacesRecursion<
  K extends string,
  P extends string,
> = K extends `${infer N}.${infer R}`
  ? `${P}.${N}` | GetNamespacesRecursion<R, `${P}.${N}`>
  : never;

export type Namespace = GetNamespaces<MessagesKey>;

type GetNamespaceKeys<
  K extends MessagesKey,
  N extends Namespace,
> = K extends `${N}.${infer R}` ? R : never;

export type NamespaceKey<N extends Namespace | undefined> = N extends Namespace
  ? GetNamespaceKeys<MessagesKey, N>
  : MessagesKey;
