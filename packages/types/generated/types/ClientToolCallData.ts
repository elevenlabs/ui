interface ClientToolCallData {
  tool_name: string;
  tool_call_id: string;
  parameters: Map<string, any>;
  additionalProperties?: Map<string, any>;
}
export { ClientToolCallData };
