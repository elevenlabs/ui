import UserTranscriptionData from './UserTranscriptionData';
interface UserTranscriptPayload {
  reservedType: 'user_transcript';
  userTranscriptionEvent: UserTranscriptionData;
  additionalProperties?: Map<string, any>;
}
export default UserTranscriptPayload;
