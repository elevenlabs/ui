import type { FetchFunction, Resolvable } from '@elevenlabs/provider-utils';

export type GatewayConfig = {
  baseURL: string;
  headers: () => Resolvable<Record<string, string | undefined>>;
  fetch?: FetchFunction;
};
