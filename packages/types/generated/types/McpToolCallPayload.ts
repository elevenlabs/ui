import McpToolCallLoading from './McpToolCallLoading';
import McpToolCallAwaitingApproval from './McpToolCallAwaitingApproval';
import McpToolCallSuccess from './McpToolCallSuccess';
import McpToolCallFailure from './McpToolCallFailure';
interface McpToolCallPayload {
  reservedType: 'mcp_tool_call';
  mcpToolCall:
    | McpToolCallLoading
    | McpToolCallAwaitingApproval
    | McpToolCallSuccess
    | McpToolCallFailure;
  additionalProperties?: Map<string, any>;
}
export default McpToolCallPayload;
