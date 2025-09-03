import McpConnectionStatusData from './McpConnectionStatusData';
interface McpConnectionStatusPayload {
  reservedType: 'mcp_connection_status';
  mcpConnectionStatus: McpConnectionStatusData;
  additionalProperties?: Map<string, any>;
}
export default McpConnectionStatusPayload;
