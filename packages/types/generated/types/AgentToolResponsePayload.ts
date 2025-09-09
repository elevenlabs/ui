import { AgentToolResponseData } from './AgentToolResponseData';
interface AgentToolResponsePayload {
  type: 'agent_tool_response';
  agent_tool_response: AgentToolResponseData;
  additionalProperties?: Map<string, any>;
}
export { AgentToolResponsePayload };
