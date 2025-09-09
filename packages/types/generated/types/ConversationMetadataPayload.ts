import { ConversationMetadataData } from './ConversationMetadataData';
interface ConversationMetadataPayload {
  type: 'conversation_initiation_metadata';
  conversation_initiation_metadata_event: ConversationMetadataData;
  additionalProperties?: Map<string, any>;
}
export { ConversationMetadataPayload };
