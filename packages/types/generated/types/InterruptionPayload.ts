import { InterruptionData } from './InterruptionData';
interface InterruptionPayload {
  type: 'interruption';
  interruption_event: InterruptionData;
  additionalProperties?: Map<string, any>;
}
export { InterruptionPayload };
