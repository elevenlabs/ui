
interface McpToolCallLoading {
  serviceId: string;
  toolCallId: string;
  toolName: string;
  toolDescription?: string;
  parameters: Map<string, any>;
  timestamp: string;
  state: 'loading';
}
export default McpToolCallLoading;
