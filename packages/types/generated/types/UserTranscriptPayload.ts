import { UserTranscriptionData } from './UserTranscriptionData';
interface UserTranscriptPayload {
  type: 'user_transcript';
  user_transcription_event: UserTranscriptionData;
  additionalProperties?: Map<string, any>;
}
export { UserTranscriptPayload };
