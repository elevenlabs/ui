interface PongPayload {
  type: 'pong';
  event_id: number;
  additionalProperties?: Map<string, any>;
}
export { PongPayload };
