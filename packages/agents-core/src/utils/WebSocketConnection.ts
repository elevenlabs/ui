import {
  BaseConnection,
  type SessionConfig,
  type FormatConfig,
  parseFormat,
} from "./BaseConnection";
import { PACKAGE_VERSION } from "../version";
import {
  type ConfigEvent,
  isValidSocketEvent,
  type OutgoingSocketEvent,
} from "./events";
import { constructOverrides } from "./overrides";

const MAIN_PROTOCOL = "convai";
const WSS_API_ORIGIN = "wss://api.elevenlabs.io";
const WSS_API_PATHNAME = "/v1/convai/conversation?agent_id=";

export class WebSocketConnection extends BaseConnection {
  public readonly conversationId: string;
  public readonly inputFormat: FormatConfig;
  public readonly outputFormat: FormatConfig;

  private constructor(
    private readonly socket: WebSocket,
    conversationId: string,
    inputFormat: FormatConfig,
    outputFormat: FormatConfig
  ) {
    super();
    this.conversationId = conversationId;
    this.inputFormat = inputFormat;
    this.outputFormat = outputFormat;

    this.socket.addEventListener("error", event => {
      // In case the error event is followed by a close event, we want the
      // latter to be the one that disconnects the session as it contains more
      // useful information.
      setTimeout(
        () =>
          this.disconnect({
            reason: "error",
            message: "The connection was closed due to a socket error.",
            context: event,
          }),
        0
      );
    });

    this.socket.addEventListener("close", event => {
      this.disconnect(
        event.code === 1000
          ? {
              reason: "agent",
              context: event,
            }
          : {
              reason: "error",
              message:
                event.reason || "The connection was closed by the server.",
              context: event,
            }
      );
    });

    this.socket.addEventListener("message", event => {
      try {
        const parsedEvent = JSON.parse(event.data);
        if (!isValidSocketEvent(parsedEvent)) {
          this.debug({
            type: "invalid_event",
            message: "Received invalid socket event",
            data: event.data,
          });
          return;
        }
        this.handleMessage(parsedEvent);
      } catch (error) {
        this.debug({
          type: "parsing_error",
          message: "Failed to parse socket message",
          error: error instanceof Error ? error.message : String(error),
          data: event.data,
        });
      }
    });
  }

  public static async create(
    config: SessionConfig
  ): Promise<WebSocketConnection> {
    let socket: WebSocket | null = null;

    try {
      const origin = config.origin ?? WSS_API_ORIGIN;
      let url: string;

      const version = config.overrides?.client?.version || PACKAGE_VERSION;
      const source = config.overrides?.client?.source || "js_sdk";

      if (config.signedUrl) {
        const separator = config.signedUrl.includes("?") ? "&" : "?";
        url = `${config.signedUrl}${separator}source=${source}&version=${version}`;
      } else {
        url = `${origin}${WSS_API_PATHNAME}${config.agentId}&source=${source}&version=${version}`;
      }

      const protocols = [MAIN_PROTOCOL];
      if (config.authorization) {
        protocols.push(`bearer.${config.authorization}`);
      }
      socket = new WebSocket(url, protocols);

      const conversationConfig = await new Promise<
        ConfigEvent["conversation_initiation_metadata_event"]
      >((resolve, reject) => {
        socket!.addEventListener(
          "open",
          () => {
            const overridesEvent = constructOverrides(config);

            socket?.send(JSON.stringify(overridesEvent));
          },
          { once: true }
        );

        socket!.addEventListener("error", event => {
          // In case the error event is followed by a close event, we want the
          // latter to be the one that rejects the promise as it contains more
          // useful information.
          setTimeout(() => reject(event), 0);
        });

        socket!.addEventListener("close", reject);

        socket!.addEventListener(
          "message",
          (event: MessageEvent) => {
            const message = JSON.parse(event.data);

            if (!isValidSocketEvent(message)) {
              return;
            }

            if (message.type === "conversation_initiation_metadata") {
              resolve(message.conversation_initiation_metadata_event);
            } else {
              console.warn(
                "First received message is not conversation metadata."
              );
            }
          },
          { once: true }
        );
      });

      const {
        conversation_id,
        agent_output_audio_format,
        user_input_audio_format,
      } = conversationConfig;

      const inputFormat = parseFormat(user_input_audio_format ?? "pcm_16000");
      const outputFormat = parseFormat(agent_output_audio_format);

      return new WebSocketConnection(
        socket,
        conversation_id,
        inputFormat,
        outputFormat
      );
    } catch (error) {
      socket?.close();
      throw error;
    }
  }

  public close() {
    this.socket.close();
  }

  public sendMessage(message: OutgoingSocketEvent) {
    this.socket.send(JSON.stringify(message));
  }

  public async setMicMuted(isMuted: boolean): Promise<void> {
    console.warn(
      `WebSocket connection setMicMuted called with ${isMuted}, but this is handled by VoiceConversation`
    );
  }
}
