
interface McpToolCallAwaitingApproval {
  serviceId: string;
  toolCallId: string;
  toolName: string;
  toolDescription?: string;
  parameters: Map<string, any>;
  timestamp: string;
  state: 'awaiting_approval';
  approvalTimeoutSecs: number;
}
export default McpToolCallAwaitingApproval;
