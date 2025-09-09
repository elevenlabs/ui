interface McpToolApprovalResultPayload {
  type: 'mcp_tool_approval_result';
  tool_call_id: string;
  is_approved: boolean;
  additionalProperties?: Map<string, any>;
}
export { McpToolApprovalResultPayload };
