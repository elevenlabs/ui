import type {
  BaseConnection,
  SessionConfig,
  ConnectionType,
} from "./BaseConnection";
import { WebSocketConnection } from "./WebSocketConnection";
import { WebRTCConnection } from "./WebRTCConnection";

function determineConnectionType(config: SessionConfig): ConnectionType {
  // If connectionType is explicitly specified, use it
  if (config.connectionType) {
    return config.connectionType;
  }

  // If conversationToken is provided, use WebRTC
  if ("conversationToken" in config && config.conversationToken) {
    return "webrtc";
  }

  // Default to WebSocket for backward compatibility
  return "websocket";
}

export async function createConnection(
  config: SessionConfig
): Promise<BaseConnection> {
  const connectionType = determineConnectionType(config);

  switch (connectionType) {
    case "websocket":
      return WebSocketConnection.create(config);
    case "webrtc":
      return WebRTCConnection.create(config);
    default:
      throw new Error(`Unknown connection type: ${connectionType}`);
  }
}
