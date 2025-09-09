import type { IncomingSocketEvent, OutgoingSocketEvent } from "./events";
import type { Mode } from "../BaseConversation";

export type Language =
  | "en"
  | "ja"
  | "zh"
  | "de"
  | "hi"
  | "fr"
  | "ko"
  | "pt"
  | "pt-br"
  | "it"
  | "es"
  | "id"
  | "nl"
  | "tr"
  | "pl"
  | "sv"
  | "bg"
  | "ro"
  | "ar"
  | "cs"
  | "el"
  | "fi"
  | "ms"
  | "da"
  | "ta"
  | "uk"
  | "ru"
  | "hu"
  | "hr"
  | "sk"
  | "no"
  | "vi"
  | "tl";

export type DelayConfig = {
  default: number;
  android?: number;
  ios?: number;
};

export type FormatConfig = {
  format: "pcm" | "ulaw";
  sampleRate: number;
  outputDeviceId?: string;
};

export type DisconnectionDetails =
  | {
      reason: "error";
      message: string;
      context: Event;
    }
  | {
      reason: "agent";
      context: CloseEvent;
    }
  | {
      reason: "user";
    };

export type OnDisconnectCallback = (details: DisconnectionDetails) => void;
export type OnMessageCallback = (event: IncomingSocketEvent) => void;

export type BaseSessionConfig = {
  origin?: string;
  authorization?: string;
  livekitUrl?: string;
  overrides?: {
    agent?: {
      prompt?: {
        prompt?: string;
      };
      firstMessage?: string;
      language?: Language;
    };
    tts?: {
      voiceId?: string;
    };
    conversation?: {
      textOnly?: boolean;
    };
    client?: {
      source?: string;
      version?: string;
    };
  };
  customLlmExtraBody?: unknown;
  dynamicVariables?: Record<string, string | number | boolean>;
  useWakeLock?: boolean;
  connectionDelay?: DelayConfig;
  textOnly?: boolean;
  userId?: string;
};

export type ConnectionType = "websocket" | "webrtc";

export type PublicSessionConfig = BaseSessionConfig & {
  agentId: string;
  connectionType: ConnectionType;
  signedUrl?: never;
  conversationToken?: never;
};

export type PrivateWebSocketSessionConfig = BaseSessionConfig & {
  signedUrl: string;
  connectionType?: "websocket";
  agentId?: never;
  conversationToken?: never;
};

export type PrivateWebRTCSessionConfig = BaseSessionConfig & {
  conversationToken: string;
  connectionType?: "webrtc";
  agentId?: never;
  signedUrl?: never;
};

// Union type for all possible session configurations
export type SessionConfig =
  | PublicSessionConfig
  | PrivateWebSocketSessionConfig
  | PrivateWebRTCSessionConfig;

export abstract class BaseConnection {
  public abstract readonly conversationId: string;
  public abstract readonly inputFormat: FormatConfig;
  public abstract readonly outputFormat: FormatConfig;

  protected queue: IncomingSocketEvent[] = [];
  protected disconnectionDetails: DisconnectionDetails | null = null;
  protected onDisconnectCallback: OnDisconnectCallback | null = null;
  protected onMessageCallback: OnMessageCallback | null = null;
  protected onModeChangeCallback: ((mode: Mode) => void) | null = null;
  protected onDebug?: (info: unknown) => void;

  constructor(config: { onDebug?: (info: unknown) => void } = {}) {
    this.onDebug = config.onDebug;
  }

  protected debug(info: unknown) {
    if (this.onDebug) this.onDebug(info);
  }

  public abstract close(): void;
  public abstract sendMessage(message: OutgoingSocketEvent): void;
  public abstract setMicMuted(isMuted: boolean): Promise<void>;

  public onMessage(callback: OnMessageCallback) {
    this.onMessageCallback = callback;
    const queue = this.queue;
    this.queue = [];

    if (queue.length > 0) {
      // Make sure the queue is flushed after the constructors finishes and
      // classes are initialized.
      queueMicrotask(() => {
        queue.forEach(callback);
      });
    }
  }

  public onDisconnect(callback: OnDisconnectCallback) {
    this.onDisconnectCallback = callback;
    const details = this.disconnectionDetails;
    if (details) {
      // Make sure the event is triggered after the constructors finishes and
      // classes are initialized.
      queueMicrotask(() => {
        callback(details);
      });
    }
  }

  public onModeChange(callback: (mode: Mode) => void) {
    this.onModeChangeCallback = callback;
  }

  protected updateMode(mode: Mode) {
    this.onModeChangeCallback?.(mode);
  }

  protected disconnect(details: DisconnectionDetails) {
    if (!this.disconnectionDetails) {
      this.disconnectionDetails = details;
      this.onDisconnectCallback?.(details);
    }
  }

  protected handleMessage(parsedEvent: IncomingSocketEvent) {
    if (this.onMessageCallback) {
      this.onMessageCallback(parsedEvent);
    } else {
      this.queue.push(parsedEvent);
    }
  }
}

export function parseFormat(format: string): FormatConfig {
  const [formatPart, sampleRatePart] = format.split("_");
  if (!["pcm", "ulaw"].includes(formatPart)) {
    throw new Error(`Invalid format: ${format}`);
  }

  const sampleRate = Number.parseInt(sampleRatePart);
  if (Number.isNaN(sampleRate)) {
    throw new Error(`Invalid sample rate: ${sampleRatePart}`);
  }

  return {
    format: formatPart as FormatConfig["format"],
    sampleRate,
  };
}
