import {
  GatewayAuthenticationError,
  GatewayModelNotFoundError,
} from '@elevenlabs/gateway';
import { AISDKError } from '@elevenlabs/provider';

export function wrapGatewayError(error: unknown): unknown {
  if (
    GatewayAuthenticationError.isInstance(error) ||
    GatewayModelNotFoundError.isInstance(error)
  ) {
    return new AISDKError({
      name: 'GatewayError',
      message:
        'Vercel AI Gateway access failed. ' +
        'If you want to use AI SDK providers directly, use the providers, e.g. @elevenlabs/openai, ' +
        'or register a different global default provider.',
      cause: error,
    });
  }

  return error;
}
