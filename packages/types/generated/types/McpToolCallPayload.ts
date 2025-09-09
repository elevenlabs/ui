import { McpToolCallLoading } from './McpToolCallLoading';
import { McpToolCallAwaitingApproval } from './McpToolCallAwaitingApproval';
import { McpToolCallSuccess } from './McpToolCallSuccess';
import { McpToolCallFailure } from './McpToolCallFailure';
interface McpToolCallPayload {
  type: 'mcp_tool_call';
  mcp_tool_call:
    | McpToolCallLoading
    | McpToolCallAwaitingApproval
    | McpToolCallSuccess
    | McpToolCallFailure;
  additionalProperties?: Map<string, any>;
}
export { McpToolCallPayload };
