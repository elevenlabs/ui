import { PingData } from './PingData';
interface PingPayload {
  type: 'ping';
  ping_event: PingData;
  additionalProperties?: Map<string, any>;
}
export { PingPayload };
