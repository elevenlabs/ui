import AudioFormat from './AudioFormat';
interface ConversationMetadataData {
  conversationId: string;
  agentOutputAudioFormat: AudioFormat;
  userInputAudioFormat: AudioFormat;
  additionalProperties?: Map<string, any>;
}
export default ConversationMetadataData;
