import { ClientToolCallData } from './ClientToolCallData';
interface ClientToolCallPayload {
  type: 'client_tool_call';
  client_tool_call: ClientToolCallData;
  additionalProperties?: Map<string, any>;
}
export { ClientToolCallPayload };
