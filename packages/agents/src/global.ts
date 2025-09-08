import { ProviderV2 } from '@elevenlabs/provider';
import { LogWarningsFunction } from './logger/log-warnings';

// add AI SDK default provider to the globalThis object
declare global {
  /**
   * The default provider to use for the AI SDK.
   * String model ids are resolved to the default provider and model id.
   *
   * If not set, the default provider is the Vercel AI gateway provider.
   *
   * @see https://elevenlabs.dev/docs/elevenlabs-core/provider-management#global-provider-configuration
   */
  var AI_SDK_DEFAULT_PROVIDER: ProviderV2 | undefined;

  /**
   * The warning logger to use for the AI SDK.
   *
   * If not set, the default logger is the console.warn function.
   *
   * If set to false, no warnings are logged.
   */
  var AI_SDK_LOG_WARNINGS: LogWarningsFunction | undefined | false;
}
