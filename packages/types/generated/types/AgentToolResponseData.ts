interface AgentToolResponseData {
  toolName: string;
  toolCallId: string;
  toolType: string;
  isError: boolean;
  additionalProperties?: Map<string, any>;
}
export default AgentToolResponseData;
