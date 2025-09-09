import type { Language } from './connection';
import type { CONVERSATION_INITIATION_CLIENT_DATA_TYPE } from './overrides';
import { FeedbackScore } from '@elevenlabs/types';
import type {
  AudioPayload as AgentAudioEvent,
  AgentResponsePayload as AgentResponseEvent,
  UserTranscriptPayload as UserTranscriptionEvent,
  InterruptionPayload as InterruptionEvent,
  ConversationMetadataPayload as ConfigEvent,
  PingPayload as PingEvent,
  ClientToolCallPayload as ClientToolCallEvent,
  VadScorePayload as VadScoreEvent,
  PongPayload as PongEvent,
  UserFeedbackPayload,
  ClientToolResultPayload,
  ContextualUpdatePayload,
  UserMessagePayload,
  UserActivityPayload,
  McpToolApprovalResultPayload as MCPToolApprovalResultEvent,
} from '@elevenlabs/types';

// Re-export the types with the names used in the SDK
export type {
  AgentAudioEvent,
  AgentResponseEvent,
  UserTranscriptionEvent,
  InterruptionEvent,
  ConfigEvent,
  PingEvent,
  ClientToolCallEvent,
  VadScoreEvent,
  PongEvent,
};

// Re-export the enum for feedback scores
export { FeedbackScore };

// Types that need custom mapping because they have different structures in our SDK
export type InternalTentativeAgentResponseEvent = {
  type: 'internal_tentative_agent_response';
  tentative_agent_response_internal_event: {
    tentative_agent_response: string;
  };
};

// User audio is special - it has no type field for performance
export type UserAudioEvent = {
  user_audio_chunk: string;
};

// Use the UserFeedbackPayload directly with the enum for the score
export type UserFeedbackEvent = UserFeedbackPayload;

export type ClientToolResultEvent = ClientToolResultPayload;

export type InitiationClientDataEvent = {
  type: typeof CONVERSATION_INITIATION_CLIENT_DATA_TYPE;
  conversation_config_override?: {
    agent?: {
      prompt?: {
        prompt?: string;
      };
      first_message?: string;
      language?: Language;
    };
    tts?: {
      voice_id?: string;
    };
    conversation?: {
      text_only?: boolean;
    };
  };
  custom_llm_extra_body?: any;
  dynamic_variables?: Record<string, string | number | boolean>;
  user_id?: string;
  source_info?: {
    source?: string;
    version?: string;
  };
};

export type ContextualUpdateEvent = ContextualUpdatePayload;

export type UserMessageEvent = UserMessagePayload;

export type UserActivityEvent = UserActivityPayload;

// TODO correction missing
export type IncomingSocketEvent =
  | UserTranscriptionEvent
  | AgentResponseEvent
  | AgentAudioEvent
  | InterruptionEvent
  | InternalTentativeAgentResponseEvent
  | ConfigEvent
  | PingEvent
  | ClientToolCallEvent
  | VadScoreEvent;

export type OutgoingSocketEvent =
  | PongEvent
  | UserAudioEvent
  | InitiationClientDataEvent
  | UserFeedbackEvent
  | ClientToolResultEvent
  | ContextualUpdateEvent
  | UserMessageEvent
  | UserActivityEvent
  | MCPToolApprovalResultEvent;

export function isValidSocketEvent(event: any): event is IncomingSocketEvent {
  return !!event.type;
}
