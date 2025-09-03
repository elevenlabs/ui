import AnonymousSchema_50 from './AnonymousSchema_50';
interface McpIntegrationStatus {
  integrationId: string;
  integrationType: AnonymousSchema_50;
  isConnected: boolean;
  toolCount: number;
  additionalProperties?: Map<string, any>;
}
export default McpIntegrationStatus;
