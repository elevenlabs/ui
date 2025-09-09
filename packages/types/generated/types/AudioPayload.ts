import { AudioEventData } from './AudioEventData';
interface AudioPayload {
  type: 'audio';
  audio_event: AudioEventData;
  additionalProperties?: Map<string, any>;
}
export { AudioPayload };
