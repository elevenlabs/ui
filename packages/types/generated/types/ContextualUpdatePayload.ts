interface ContextualUpdatePayload {
  reservedType: 'contextual_update';
  reservedText: string;
  additionalProperties?: Map<string, any>;
}
export default ContextualUpdatePayload;
