interface ClientToolResultPayload {
  reservedType: 'client_tool_result';
  toolCallId: string;
  result: string;
  isError: boolean;
  additionalProperties?: Map<string, any>;
}
export default ClientToolResultPayload;
