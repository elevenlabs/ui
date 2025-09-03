import AgentResponseCorrectionData from './AgentResponseCorrectionData';
interface AgentResponseCorrectionPayload {
  reservedType: 'agent_response_correction';
  agentResponseCorrectionEvent: AgentResponseCorrectionData;
  additionalProperties?: Map<string, any>;
}
export default AgentResponseCorrectionPayload;
