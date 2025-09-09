import { BaseConversation, type PartialOptions } from "./BaseConversation";
import { TextConversation } from "./TextConversation";
import { VoiceConversation } from "./VoiceConversation";

export type {
  Mode,
  Role,
  Options,
  PartialOptions,
  ClientToolsConfig,
  Callbacks,
  Status,
} from "./BaseConversation";
export type { InputConfig } from "./utils/input";
export { Input } from "./utils/input";
export { Output } from "./utils/output";
export type { IncomingSocketEvent, VadScoreEvent } from "./utils/events";
export type {
  SessionConfig,
  BaseSessionConfig,
  DisconnectionDetails,
  Language,
  ConnectionType,
  FormatConfig,
} from "./utils/BaseConnection";
export { createConnection } from "./utils/ConnectionFactory";
export { WebSocketConnection } from "./utils/WebSocketConnection";
export { WebRTCConnection } from "./utils/WebRTCConnection";
export { postOverallFeedback } from "./utils/postOverallFeedback";
export { VoiceConversation } from "./VoiceConversation";
export { TextConversation } from "./TextConversation";

export class Conversation extends BaseConversation {
  public static startSession(options: PartialOptions): Promise<Conversation> {
    return options.textOnly
      ? TextConversation.startSession(options)
      : VoiceConversation.startSession(options);
  }
}
