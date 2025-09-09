import { TentativeTranscriptionData } from './TentativeTranscriptionData';
interface TentativeUserTranscriptPayload {
  type: 'tentative_user_transcript';
  tentative_user_transcription_event: TentativeTranscriptionData;
  additionalProperties?: Map<string, any>;
}
export { TentativeUserTranscriptPayload };
