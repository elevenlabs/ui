import AgentToolResponseData from './AgentToolResponseData';
interface AgentToolResponsePayload {
  reservedType: 'agent_tool_response';
  agentToolResponse: AgentToolResponseData;
  additionalProperties?: Map<string, any>;
}
export default AgentToolResponsePayload;
