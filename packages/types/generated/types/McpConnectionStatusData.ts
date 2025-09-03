import McpIntegrationStatus from './McpIntegrationStatus';
interface McpConnectionStatusData {
  integrations: McpIntegrationStatus[];
  additionalProperties?: Map<string, any>;
}
export default McpConnectionStatusData;
