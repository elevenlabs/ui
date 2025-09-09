// Re-export from the new connection architecture for backward compatibility
export {
  Language,
  DelayConfig,
  FormatConfig,
  DisconnectionDetails,
  OnDisconnectCallback,
  OnMessageCallback,
  SessionConfig,
  parseFormat,
} from "./BaseConnection";

import { createConnection } from "./ConnectionFactory";
export { createConnection };
export { WebSocketConnection } from "./WebSocketConnection";
export { WebRTCConnection } from "./WebRTCConnection";
export { BaseConnection } from "./BaseConnection";
import type { SessionConfig } from "./BaseConnection";

// Legacy Connection class that uses the factory
export class Connection {
  public static async create(config: SessionConfig) {
    return createConnection(config);
  }
}
