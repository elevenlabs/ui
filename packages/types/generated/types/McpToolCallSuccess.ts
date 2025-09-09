interface McpToolCallSuccess {
  service_id: string;
  tool_call_id: string;
  tool_name: string;
  tool_description?: string;
  parameters: Map<string, any>;
  timestamp: string;
  state: 'success';
  result: Map<string, any>[];
}
export { McpToolCallSuccess };
