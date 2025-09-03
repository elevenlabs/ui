import ClientToolCallData from './ClientToolCallData';
interface ClientToolCallPayload {
  reservedType: 'client_tool_call';
  clientToolCall: ClientToolCallData;
  additionalProperties?: Map<string, any>;
}
export default ClientToolCallPayload;
