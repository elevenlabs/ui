
interface ConversationInitiationPayload {
  reservedType: 'conversation_initiation_client_data';
  conversationConfigOverride?: Map<string, any>;
  customLlmExtraBody?: Map<string, any>;
  dynamicVariables?: Map<string, any>;
  additionalProperties?: Map<string, any>;
}
export default ConversationInitiationPayload;
