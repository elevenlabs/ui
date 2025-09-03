import AudioEventData from './AudioEventData';
interface AudioPayload {
  reservedType: 'audio';
  audioEvent: AudioEventData;
  additionalProperties?: Map<string, any>;
}
export default AudioPayload;
