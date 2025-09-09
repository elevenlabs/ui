import { useEffect, useRef, useState } from "react";
import {
  Conversation,
  type SessionConfig,
  type Options,
  type ClientToolsConfig,
  type InputConfig,
  type FormatConfig,
  type Mode,
  type Status,
  type Callbacks,
} from "@elevenlabs/client";

// Device configuration types for audio device switching
export type DeviceFormatConfig = {
  format: "pcm" | "ulaw";
  sampleRate: number;
  outputDeviceId?: string;
};

export type DeviceInputConfig = {
  preferHeadphonesForIosDevices?: boolean;
  inputDeviceId?: string;
};

import { PACKAGE_VERSION } from "./version";

export type Location = "us" | "global" | "eu-residency" | "in-residency";

export function parseLocation(location: string = "us"): Location {
  switch (location) {
    case "eu-residency":
    case "in-residency":
    case "us":
    case "global":
      return location;
    default:
      console.warn(
        `[ConversationalAI] Invalid server-location: ${location}. Defaulting to "us"`
      );
      return "us";
  }
}

export function getOriginForLocation(location: Location): string {
  const originMap: Record<Location, string> = {
    us: "wss://api.elevenlabs.io",
    "eu-residency": "wss://api.eu.residency.elevenlabs.io",
    "in-residency": "wss://api.in.residency.elevenlabs.io",
    global: "wss://api.elevenlabs.io",
  };

  return originMap[location];
}

export type {
  Role,
  Mode,
  Status,
  SessionConfig,
  DisconnectionDetails,
  Language,
  VadScoreEvent,
  InputConfig,
  FormatConfig,
  VoiceConversation,
  TextConversation,
} from "@elevenlabs/client";
export { postOverallFeedback } from "@elevenlabs/client";

export type HookOptions = Partial<
  SessionConfig &
    HookCallbacks &
    ClientToolsConfig &
    InputConfig &
    FormatConfig & {
      serverLocation?: Location | string;
    }
>;
export type ControlledState = {
  micMuted?: boolean;
  volume?: number;
};
export type HookCallbacks = Pick<
  Callbacks,
  | "onConnect"
  | "onDisconnect"
  | "onError"
  | "onMessage"
  | "onAudio"
  | "onModeChange"
  | "onStatusChange"
  | "onCanSendFeedbackChange"
  | "onDebug"
  | "onUnhandledClientToolCall"
  | "onVadScore"
>;

export function useConversation<T extends HookOptions & ControlledState>(
  props: T = {} as T
) {
  const { micMuted, volume, serverLocation, ...defaultOptions } = props;
  const conversationRef = useRef<Conversation | null>(null);
  const lockRef = useRef<Promise<Conversation> | null>(null);
  const [status, setStatus] = useState<Status>("disconnected");
  const [canSendFeedback, setCanSendFeedback] = useState(false);
  const [mode, setMode] = useState<Mode>("listening");

  useEffect(() => {
    if (micMuted !== undefined) {
      conversationRef?.current?.setMicMuted(micMuted);
    }
  }, [micMuted]);

  useEffect(() => {
    if (volume !== undefined) {
      conversationRef?.current?.setVolume({ volume });
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      conversationRef.current?.endSession();
    };
  }, []);

  return {
    startSession: (async (options?: HookOptions) => {
      if (conversationRef.current?.isOpen()) {
        return conversationRef.current.getId();
      }

      if (lockRef.current) {
        const conversation = await lockRef.current;
        return conversation.getId();
      }

      try {
        const resolvedServerLocation = parseLocation(
          options?.serverLocation || serverLocation
        );
        const origin = getOriginForLocation(resolvedServerLocation);

        lockRef.current = Conversation.startSession({
          ...(defaultOptions ?? {}),
          ...(options ?? {}),
          origin,
          overrides: {
            ...(defaultOptions?.overrides ?? {}),
            ...(options?.overrides ?? {}),
            client: {
              ...(defaultOptions?.overrides?.client ?? {}),
              ...(options?.overrides?.client ?? {}),
              source:
                options?.overrides?.client?.source ||
                defaultOptions?.overrides?.client?.source ||
                "react_sdk",
              version:
                options?.overrides?.client?.version ||
                defaultOptions?.overrides?.client?.version ||
                PACKAGE_VERSION,
            },
          },
          // Pass through user-provided callbacks
          onConnect: options?.onConnect || defaultOptions?.onConnect,
          onDisconnect: options?.onDisconnect || defaultOptions?.onDisconnect,
          onError: options?.onError || defaultOptions?.onError,
          onMessage: options?.onMessage || defaultOptions?.onMessage,
          onAudio: options?.onAudio || defaultOptions?.onAudio,
          onDebug: options?.onDebug || defaultOptions?.onDebug,
          onUnhandledClientToolCall:
            options?.onUnhandledClientToolCall ||
            defaultOptions?.onUnhandledClientToolCall,
          onVadScore: options?.onVadScore || defaultOptions?.onVadScore,
          onModeChange: ({ mode }) => {
            setMode(mode);
            (options?.onModeChange || defaultOptions?.onModeChange)?.({ mode });
          },
          onStatusChange: ({ status }) => {
            setStatus(status);
            (options?.onStatusChange || defaultOptions?.onStatusChange)?.({
              status,
            });
          },
          onCanSendFeedbackChange: ({ canSendFeedback }) => {
            setCanSendFeedback(canSendFeedback);
            (
              options?.onCanSendFeedbackChange ||
              defaultOptions?.onCanSendFeedbackChange
            )?.({ canSendFeedback });
          },
        } as Options);

        conversationRef.current = await lockRef.current;
        // Persist controlled state between sessions
        if (micMuted !== undefined) {
          conversationRef.current.setMicMuted(micMuted);
        }
        if (volume !== undefined) {
          conversationRef.current.setVolume({ volume });
        }

        return conversationRef.current.getId();
      } finally {
        lockRef.current = null;
      }
    }) as T extends SessionConfig
      ? (options?: HookOptions) => Promise<string>
      : (options: SessionConfig & HookOptions) => Promise<string>,
    endSession: async () => {
      const conversation = conversationRef.current;
      conversationRef.current = null;
      await conversation?.endSession();
    },
    setVolume: ({ volume }: { volume: number }) => {
      conversationRef.current?.setVolume({ volume });
    },
    getInputByteFrequencyData: () => {
      return conversationRef.current?.getInputByteFrequencyData();
    },
    getOutputByteFrequencyData: () => {
      return conversationRef.current?.getOutputByteFrequencyData();
    },
    getInputVolume: () => {
      return conversationRef.current?.getInputVolume() ?? 0;
    },
    getOutputVolume: () => {
      return conversationRef.current?.getOutputVolume() ?? 0;
    },
    sendFeedback: (like: boolean) => {
      conversationRef.current?.sendFeedback(like);
    },
    getId: () => {
      return conversationRef.current?.getId();
    },
    sendContextualUpdate: (text: string) => {
      conversationRef.current?.sendContextualUpdate(text);
    },
    sendUserMessage: (text: string) => {
      conversationRef.current?.sendUserMessage(text);
    },
    sendUserActivity: () => {
      conversationRef.current?.sendUserActivity();
    },
    sendMCPToolApprovalResult: (toolCallId: string, isApproved: boolean) => {
      conversationRef.current?.sendMCPToolApprovalResult(
        toolCallId,
        isApproved
      );
    },
    changeInputDevice: async (
      config: DeviceFormatConfig & DeviceInputConfig
    ) => {
      if (
        conversationRef.current &&
        "changeInputDevice" in conversationRef.current
      ) {
        return await (
          conversationRef.current as unknown as {
            changeInputDevice: (config: any) => Promise<any>;
          }
        ).changeInputDevice(config);
      }
      throw new Error(
        "Device switching is only available for voice conversations"
      );
    },
    changeOutputDevice: async (config: DeviceFormatConfig) => {
      if (
        conversationRef.current &&
        "changeOutputDevice" in conversationRef.current
      ) {
        return await (
          conversationRef.current as unknown as {
            changeOutputDevice: (config: any) => Promise<any>;
          }
        ).changeOutputDevice(config);
      }
      throw new Error(
        "Device switching is only available for voice conversations"
      );
    },
    status,
    canSendFeedback,
    micMuted,
    isSpeaking: mode === "speaking",
  };
}

// const con = useConversation({agentId: ""})
