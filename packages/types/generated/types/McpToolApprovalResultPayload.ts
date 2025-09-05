interface McpToolApprovalResultPayload {
  reservedType: 'mcp_tool_approval_result';
  toolCallId: string;
  isApproved: boolean;
  additionalProperties?: Map<string, any>;
}
export default McpToolApprovalResultPayload;
