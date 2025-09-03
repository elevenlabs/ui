import ConversationMetadataData from './ConversationMetadataData';
interface ConversationMetadataPayload {
  reservedType: 'conversation_initiation_metadata';
  conversationInitiationMetadataEvent: ConversationMetadataData;
  additionalProperties?: Map<string, any>;
}
export default ConversationMetadataPayload;
