
interface PongPayload {
  reservedType: 'pong';
  eventId: number;
  additionalProperties?: Map<string, any>;
}
export default PongPayload;
