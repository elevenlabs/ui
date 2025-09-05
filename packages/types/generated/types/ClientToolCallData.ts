
interface ClientToolCallData {
  toolName: string;
  toolCallId: string;
  parameters: Map<string, any>;
  additionalProperties?: Map<string, any>;
}
export default ClientToolCallData;
