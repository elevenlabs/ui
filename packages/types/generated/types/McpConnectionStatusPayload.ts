import { McpConnectionStatusData } from './McpConnectionStatusData';
interface McpConnectionStatusPayload {
  type: 'mcp_connection_status';
  mcp_connection_status: McpConnectionStatusData;
  additionalProperties?: Map<string, any>;
}
export { McpConnectionStatusPayload };
