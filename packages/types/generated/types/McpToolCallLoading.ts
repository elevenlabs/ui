interface McpToolCallLoading {
  service_id: string;
  tool_call_id: string;
  tool_name: string;
  tool_description?: string;
  parameters: Map<string, any>;
  timestamp: string;
  state: 'loading';
}
export { McpToolCallLoading };
