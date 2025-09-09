interface ClientToolResultPayload {
  type: 'client_tool_result';
  tool_call_id: string;
  result: string;
  is_error: boolean;
  additionalProperties?: Map<string, any>;
}
export { ClientToolResultPayload };
