import AgentResponseData from './AgentResponseData';
interface AgentResponsePayload {
  reservedType: 'agent_response';
  agentResponseEvent: AgentResponseData;
  additionalProperties?: Map<string, any>;
}
export default AgentResponsePayload;
