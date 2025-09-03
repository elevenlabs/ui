import InterruptionData from './InterruptionData';
interface InterruptionPayload {
  reservedType: 'interruption';
  interruptionEvent: InterruptionData;
  additionalProperties?: Map<string, any>;
}
export default InterruptionPayload;
