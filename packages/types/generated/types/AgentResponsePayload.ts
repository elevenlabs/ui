import { AgentResponseData } from './AgentResponseData';
interface AgentResponsePayload {
  type: 'agent_response';
  agent_response_event: AgentResponseData;
  additionalProperties?: Map<string, any>;
}
export { AgentResponsePayload };
