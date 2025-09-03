import TentativeTranscriptionData from './TentativeTranscriptionData';
interface TentativeUserTranscriptPayload {
  reservedType: 'tentative_user_transcript';
  tentativeUserTranscriptionEvent: TentativeTranscriptionData;
  additionalProperties?: Map<string, any>;
}
export default TentativeUserTranscriptPayload;
