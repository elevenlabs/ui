import { AgentResponseCorrectionData } from './AgentResponseCorrectionData';
interface AgentResponseCorrectionPayload {
  type: 'agent_response_correction';
  agent_response_correction_event: AgentResponseCorrectionData;
  additionalProperties?: Map<string, any>;
}
export { AgentResponseCorrectionPayload };
