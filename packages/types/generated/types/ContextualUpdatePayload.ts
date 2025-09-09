interface ContextualUpdatePayload {
  type: 'contextual_update';
  text: string;
  additionalProperties?: Map<string, any>;
}
export { ContextualUpdatePayload };
