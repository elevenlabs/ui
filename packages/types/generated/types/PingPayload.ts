import PingData from './PingData';
interface PingPayload {
  reservedType: 'ping';
  pingEvent: PingData;
  additionalProperties?: Map<string, any>;
}
export default PingPayload;
