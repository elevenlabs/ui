
interface McpToolCallSuccess {
  serviceId: string;
  toolCallId: string;
  toolName: string;
  toolDescription?: string;
  parameters: Map<string, any>;
  timestamp: string;
  state: 'success';
  result: Map<string, any>[];
}
export default McpToolCallSuccess;
