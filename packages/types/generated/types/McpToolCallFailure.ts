
interface McpToolCallFailure {
  serviceId: string;
  toolCallId: string;
  toolName: string;
  toolDescription?: string;
  parameters: Map<string, any>;
  timestamp: string;
  state: 'failure';
  errorMessage: string;
}
export default McpToolCallFailure;
