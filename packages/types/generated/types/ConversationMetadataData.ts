import { AudioFormat } from './AudioFormat';
interface ConversationMetadataData {
  conversation_id: string;
  agent_output_audio_format: AudioFormat;
  user_input_audio_format: AudioFormat;
  additionalProperties?: Map<string, any>;
}
export { ConversationMetadataData };
