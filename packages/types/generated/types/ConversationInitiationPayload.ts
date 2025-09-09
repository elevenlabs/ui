interface ConversationInitiationPayload {
  type: 'conversation_initiation_client_data';
  conversation_config_override?: Map<string, any>;
  custom_llm_extra_body?: Map<string, any>;
  dynamic_variables?: Map<string, any>;
  additionalProperties?: Map<string, any>;
}
export { ConversationInitiationPayload };
