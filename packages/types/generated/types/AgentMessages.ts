import AudioPayload from './AudioPayload';
import UserTranscriptPayload from './UserTranscriptPayload';
import TentativeUserTranscriptPayload from './TentativeUserTranscriptPayload';
import AgentResponsePayload from './AgentResponsePayload';
import AgentResponseCorrectionPayload from './AgentResponseCorrectionPayload';
import InterruptionPayload from './InterruptionPayload';
import ConversationMetadataPayload from './ConversationMetadataPayload';
import ClientToolCallPayload from './ClientToolCallPayload';
import AgentToolResponsePayload from './AgentToolResponsePayload';
import McpToolCallPayload from './McpToolCallPayload';
import McpConnectionStatusPayload from './McpConnectionStatusPayload';
import VadScorePayload from './VadScorePayload';
import PingPayload from './PingPayload';
import UserAudioPayload from './UserAudioPayload';
import PongPayload from './PongPayload';
import UserMessagePayload from './UserMessagePayload';
import UserActivityPayload from './UserActivityPayload';
import UserFeedbackPayload from './UserFeedbackPayload';
import ClientToolResultPayload from './ClientToolResultPayload';
import McpToolApprovalResultPayload from './McpToolApprovalResultPayload';
import ContextualUpdatePayload from './ContextualUpdatePayload';
import ConversationInitiationPayload from './ConversationInitiationPayload';
type AgentMessages =
  | AudioPayload
  | UserTranscriptPayload
  | TentativeUserTranscriptPayload
  | AgentResponsePayload
  | AgentResponseCorrectionPayload
  | InterruptionPayload
  | ConversationMetadataPayload
  | ClientToolCallPayload
  | AgentToolResponsePayload
  | McpToolCallPayload
  | McpConnectionStatusPayload
  | VadScorePayload
  | PingPayload
  | UserAudioPayload
  | PongPayload
  | UserMessagePayload
  | UserActivityPayload
  | UserFeedbackPayload
  | ClientToolResultPayload
  | McpToolApprovalResultPayload
  | ContextualUpdatePayload
  | ConversationInitiationPayload;
export default AgentMessages;
