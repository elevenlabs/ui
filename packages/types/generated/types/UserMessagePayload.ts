
interface UserMessagePayload {
  reservedType: 'user_message';
  reservedText?: string;
  additionalProperties?: Map<string, any>;
}
export default UserMessagePayload;
