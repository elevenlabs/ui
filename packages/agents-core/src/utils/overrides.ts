import type { SessionConfig } from "./BaseConnection";
import type { InitiationClientDataEvent } from "./events";

export const CONVERSATION_INITIATION_CLIENT_DATA_TYPE =
  "conversation_initiation_client_data";

export function constructOverrides(
  config: SessionConfig
): InitiationClientDataEvent {
  const overridesEvent: InitiationClientDataEvent = {
    type: CONVERSATION_INITIATION_CLIENT_DATA_TYPE,
  };

  if (config.overrides) {
    overridesEvent.conversation_config_override = {
      agent: {
        prompt: config.overrides.agent?.prompt,
        first_message: config.overrides.agent?.firstMessage,
        language: config.overrides.agent?.language,
      },
      tts: {
        voice_id: config.overrides.tts?.voiceId,
      },
      conversation: {
        text_only: config.overrides.conversation?.textOnly,
      },
    };
  }

  if (config.customLlmExtraBody) {
    overridesEvent.custom_llm_extra_body = config.customLlmExtraBody;
  }

  if (config.dynamicVariables) {
    overridesEvent.dynamic_variables = config.dynamicVariables;
  }

  if (config.userId) {
    overridesEvent.user_id = config.userId;
  }

  if (config.overrides?.client) {
    overridesEvent.source_info = {
      source: config.overrides.client.source,
      version: config.overrides.client.version,
    };
  }

  return overridesEvent;
}
