interface UserMessagePayload {
  type: 'user_message';
  text?: string;
  additionalProperties?: Map<string, any>;
}
export { UserMessagePayload };
