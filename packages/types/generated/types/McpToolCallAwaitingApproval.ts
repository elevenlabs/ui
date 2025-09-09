interface McpToolCallAwaitingApproval {
  service_id: string;
  tool_call_id: string;
  tool_name: string;
  tool_description?: string;
  parameters: Map<string, any>;
  timestamp: string;
  state: 'awaiting_approval';
  approval_timeout_secs: number;
}
export { McpToolCallAwaitingApproval };
