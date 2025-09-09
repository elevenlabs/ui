import { McpIntegrationType } from './McpIntegrationType';
interface McpIntegrationStatus {
  integration_id: string;
  integration_type: McpIntegrationType;
  is_connected: boolean;
  tool_count: number;
  additionalProperties?: Map<string, any>;
}
export { McpIntegrationStatus };
