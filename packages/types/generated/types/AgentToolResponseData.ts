interface AgentToolResponseData {
  tool_name: string;
  tool_call_id: string;
  tool_type: string;
  is_error: boolean;
  additionalProperties?: Map<string, any>;
}
export { AgentToolResponseData };
