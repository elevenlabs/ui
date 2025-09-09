import {
  BaseConnection,
  type SessionConfig,
  type FormatConfig,
  parseFormat,
} from "./BaseConnection";
import { PACKAGE_VERSION } from "../version";
import { isValidSocketEvent, type OutgoingSocketEvent } from "./events";
import {
  Room,
  RoomEvent,
  Track,
  ConnectionState,
  createLocalAudioTrack,
} from "livekit-client";
import type {
  RemoteAudioTrack,
  Participant,
  TrackPublication,
} from "livekit-client";
import {
  constructOverrides,
  CONVERSATION_INITIATION_CLIENT_DATA_TYPE,
} from "./overrides";
import { arrayBufferToBase64 } from "./audio";
import { loadRawAudioProcessor } from "./rawAudioProcessor";

const DEFAULT_LIVEKIT_WS_URL = "wss://livekit.rtc.elevenlabs.io";
const HTTPS_API_ORIGIN = "https://api.elevenlabs.io";

// Convert WSS origin to HTTPS for API calls
function convertWssToHttps(origin: string): string {
  return origin.replace(/^wss:\/\//, "https://");
}

export type ConnectionConfig = SessionConfig & {
  onDebug?: (info: unknown) => void;
};

export class WebRTCConnection extends BaseConnection {
  public conversationId: string;
  public readonly inputFormat: FormatConfig;
  public readonly outputFormat: FormatConfig;

  private room: Room;
  private isConnected = false;
  private audioEventId = 1;
  private audioCaptureContext: AudioContext | null = null;
  private audioElements: HTMLAudioElement[] = [];
  private outputDeviceId: string | null = null;

  private outputAnalyser: AnalyserNode | null = null;
  private outputFrequencyData: Uint8Array<ArrayBuffer> | null = null;

  private constructor(
    room: Room,
    conversationId: string,
    inputFormat: FormatConfig,
    outputFormat: FormatConfig,
    config: { onDebug?: (info: unknown) => void } = {}
  ) {
    super(config);
    this.room = room;
    this.conversationId = conversationId;
    this.inputFormat = inputFormat;
    this.outputFormat = outputFormat;

    this.setupRoomEventListeners();
  }

  public static async create(
    config: ConnectionConfig
  ): Promise<WebRTCConnection> {
    let conversationToken: string;

    // Handle different authentication scenarios
    if ("conversationToken" in config && config.conversationToken) {
      // Direct token provided
      conversationToken = config.conversationToken;
    } else if ("agentId" in config && config.agentId) {
      // Agent ID provided - fetch token from API
      try {
        const version = config.overrides?.client?.version || PACKAGE_VERSION;
        const source = config.overrides?.client?.source || "js_sdk";
        const configOrigin = config.origin ?? HTTPS_API_ORIGIN;
        const origin = convertWssToHttps(configOrigin); //origin is wss, not https
        const url = `${origin}/v1/convai/conversation/token?agent_id=${config.agentId}&source=${source}&version=${version}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `ElevenLabs API returned ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        conversationToken = data.token;

        if (!conversationToken) {
          throw new Error("No conversation token received from API");
        }
      } catch (error) {
        let msg = error instanceof Error ? error.message : String(error);
        if (error instanceof Error && error.message.includes("401")) {
          msg =
            "Your agent has authentication enabled, but no signed URL or conversation token was provided.";
        }

        throw new Error(
          `Failed to fetch conversation token for agent ${config.agentId}: ${msg}`
        );
      }
    } else {
      throw new Error(
        "Either conversationToken or agentId is required for WebRTC connection"
      );
    }

    const room = new Room();

    try {
      // Create connection instance first to set up event listeners
      const conversationId = `room_${Date.now()}`;
      const inputFormat = parseFormat("pcm_48000");
      const outputFormat = parseFormat("pcm_48000");
      const connection = new WebRTCConnection(
        room,
        conversationId,
        inputFormat,
        outputFormat,
        config
      );

      // Use configurable LiveKit URL or default if not provided
      const livekitUrl = config.livekitUrl || DEFAULT_LIVEKIT_WS_URL;

      // Connect to the LiveKit room and wait for the Connected event
      await room.connect(livekitUrl, conversationToken);

      // Wait for the Connected event to ensure isConnected is true
      await new Promise<void>(resolve => {
        if (connection.isConnected) {
          resolve();
        } else {
          const onConnected = () => {
            room.off(RoomEvent.Connected, onConnected);
            resolve();
          };
          room.on(RoomEvent.Connected, onConnected);
        }
      });

      if (room.name) {
        connection.conversationId =
          room.name.match(/(conv_[a-zA-Z0-9]+)/)?.[0] || room.name;
      }

      // Enable microphone and send overrides
      await room.localParticipant.setMicrophoneEnabled(true);

      const overridesEvent = constructOverrides(config);

      connection.debug({
        type: CONVERSATION_INITIATION_CLIENT_DATA_TYPE,
        message: overridesEvent,
      });

      await connection.sendMessage(overridesEvent);

      return connection;
    } catch (error) {
      await room.disconnect();
      throw error;
    }
  }

  private setupRoomEventListeners() {
    this.room.on(RoomEvent.Connected, async () => {
      this.isConnected = true;
      console.info("WebRTC room connected");
    });

    this.room.on(RoomEvent.Disconnected, reason => {
      this.isConnected = false;
      this.disconnect({
        reason: "agent",
        context: new CloseEvent("close", { reason: reason?.toString() }),
      });
    });

    this.room.on(RoomEvent.ConnectionStateChanged, state => {
      if (state === ConnectionState.Disconnected) {
        this.isConnected = false;
        this.disconnect({
          reason: "error",
          message: `LiveKit connection state changed to ${state}`,
          context: new Event("connection_state_changed"),
        });
      }
    });

    // Handle incoming data messages
    this.room.on(
      RoomEvent.DataReceived,
      (payload: Uint8Array, _participant) => {
        try {
          const message = JSON.parse(new TextDecoder().decode(payload));

          // Filter out audio messages for WebRTC - they're handled via audio tracks
          if (message.type === "audio") {
            return;
          }

          if (isValidSocketEvent(message)) {
            this.handleMessage(message);
          } else {
            console.warn("Invalid socket event received:", message);
          }
        } catch (error) {
          console.warn("Failed to parse incoming data message:", error);
          console.warn("Raw payload:", new TextDecoder().decode(payload));
        }
      }
    );

    this.room.on(
      RoomEvent.TrackSubscribed,
      async (
        track: Track,
        _publication: TrackPublication,
        participant: Participant
      ) => {
        if (
          track.kind === Track.Kind.Audio &&
          participant.identity.includes("agent")
        ) {
          // Play the audio track
          const remoteAudioTrack = track as RemoteAudioTrack;
          const audioElement = remoteAudioTrack.attach();
          audioElement.autoplay = true;
          audioElement.controls = false;

          // Set output device if one was previously selected
          if (this.outputDeviceId && audioElement.setSinkId) {
            try {
              await audioElement.setSinkId(this.outputDeviceId);
            } catch (error) {
              console.warn(
                "Failed to set output device for new audio element:",
                error
              );
            }
          }

          // Add to DOM (hidden) to ensure it plays
          audioElement.style.display = "none";
          document.body.appendChild(audioElement);

          // Store reference for volume control
          this.audioElements.push(audioElement);

          // Apply current volume if it exists (for when volume was set before audio track arrived)
          if (this.audioElements.length === 1) {
            // First audio element - trigger a callback to sync with current volume
            this.onDebug?.({ type: "audio_element_ready" });
          }

          // Set up audio capture for onAudio callback
          await this.setupAudioCapture(remoteAudioTrack);
        }
      }
    );

    this.room.on(
      RoomEvent.ActiveSpeakersChanged,
      async (speakers: Participant[]) => {
        if (speakers.length > 0) {
          this.updateMode(
            speakers[0].identity.startsWith("agent") ? "speaking" : "listening"
          );
        } else {
          this.updateMode("listening");
        }
      }
    );
  }

  public close() {
    if (this.isConnected) {
      try {
        // Explicitly stop all local tracks before disconnecting to ensure microphone is released
        this.room.localParticipant.audioTrackPublications.forEach(
          publication => {
            if (publication.track) {
              publication.track.stop();
            }
          }
        );
      } catch (error) {
        console.warn("Error stopping local tracks:", error);
      }

      // Clean up audio capture context (non-blocking)
      if (this.audioCaptureContext) {
        this.audioCaptureContext.close().catch(error => {
          console.warn("Error closing audio capture context:", error);
        });
        this.audioCaptureContext = null;
      }

      // Clean up audio elements
      this.audioElements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
      this.audioElements = [];

      this.room.disconnect();
    }
  }

  public async sendMessage(message: OutgoingSocketEvent) {
    if (!this.isConnected || !this.room.localParticipant) {
      console.warn(
        "Cannot send message: room not connected or no local participant"
      );
      return;
    }

    // In WebRTC mode, audio is sent via published tracks, not data messages
    if ("user_audio_chunk" in message) {
      // Ignore audio data messages - audio flows through WebRTC tracks
      return;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(message));

      await this.room.localParticipant.publishData(data, { reliable: true });
    } catch (error) {
      this.debug({
        type: "send_message_error",
        message: {
          message,
          error,
        },
      });
      console.error("Failed to send message via WebRTC:", error);
    }
  }

  // Get the room instance for advanced usage
  public getRoom(): Room {
    return this.room;
  }

  public async setMicMuted(isMuted: boolean): Promise<void> {
    if (!this.isConnected || !this.room.localParticipant) {
      console.warn(
        "Cannot set microphone muted: room not connected or no local participant"
      );
      return;
    }

    // Get the microphone track publication
    const micTrackPublication = this.room.localParticipant.getTrackPublication(
      Track.Source.Microphone
    );

    if (micTrackPublication?.track) {
      try {
        // Use LiveKit's built-in track muting
        if (isMuted) {
          await micTrackPublication.track.mute();
        } else {
          await micTrackPublication.track.unmute();
        }
      } catch (_error) {
        // If track muting fails, fall back to participant-level control
        await this.room.localParticipant.setMicrophoneEnabled(!isMuted);
      }
    } else {
      // No track found, use participant-level control directly
      await this.room.localParticipant.setMicrophoneEnabled(!isMuted);
    }
  }

  private async setupAudioCapture(track: RemoteAudioTrack) {
    try {
      // Create audio context for processing
      const audioContext = new AudioContext();
      this.audioCaptureContext = audioContext;

      // Create analyser for frequency data
      this.outputAnalyser = audioContext.createAnalyser();
      this.outputAnalyser.fftSize = 2048;
      this.outputAnalyser.smoothingTimeConstant = 0.8;

      // Create MediaStream from the track
      const mediaStream = new MediaStream([track.mediaStreamTrack]);

      // Create audio source from the stream
      const source = audioContext.createMediaStreamSource(mediaStream);

      // Connect source to analyser
      source.connect(this.outputAnalyser);

      await loadRawAudioProcessor(audioContext.audioWorklet);
      const worklet = new AudioWorkletNode(audioContext, "raw-audio-processor");

      // Connect analyser to worklet for processing
      this.outputAnalyser.connect(worklet);

      // Configure the processor for the output format
      worklet.port.postMessage({
        type: "setFormat",
        format: this.outputFormat.format,
        sampleRate: this.outputFormat.sampleRate,
      });

      // Handle processed audio data
      worklet.port.onmessage = (event: MessageEvent) => {
        const [audioData, maxVolume] = event.data;

        // Only send audio if there's significant volume (not just silence)
        const volumeThreshold = 0.01;

        if (maxVolume > volumeThreshold) {
          // Convert to base64
          const base64Audio = arrayBufferToBase64(audioData.buffer);

          // Use sequential event ID for proper feedback tracking
          const eventId = this.audioEventId++;

          // Trigger the onAudio callback by simulating an audio event
          this.handleMessage({
            type: "audio",
            audio_event: {
              audio_base_64: base64Audio,
              event_id: eventId,
            },
          });
        }
      };

      // Connect the audio processing chain
      source.connect(worklet);
    } catch (error) {
      console.warn("Failed to set up audio capture:", error);
    }
  }

  public setAudioVolume(volume: number) {
    this.audioElements.forEach(element => {
      element.volume = volume;
    });
  }

  public async setAudioOutputDevice(deviceId: string): Promise<void> {
    if (!("setSinkId" in HTMLAudioElement.prototype)) {
      throw new Error("setSinkId is not supported in this browser");
    }

    // Set output device for all existing audio elements
    const promises = this.audioElements.map(async element => {
      try {
        await element.setSinkId(deviceId);
      } catch (error) {
        console.error("Failed to set sink ID for audio element:", error);
        throw error;
      }
    });

    await Promise.all(promises);

    // Store the device ID for future audio elements
    this.outputDeviceId = deviceId;
  }

  public async setAudioInputDevice(deviceId: string): Promise<void> {
    if (!this.isConnected || !this.room.localParticipant) {
      throw new Error(
        "Cannot change input device: room not connected or no local participant"
      );
    }

    try {
      // Get the current microphone track publication
      const currentMicTrackPublication =
        this.room.localParticipant.getTrackPublication(Track.Source.Microphone);

      // Stop the current microphone track if it exists
      if (currentMicTrackPublication?.track) {
        await currentMicTrackPublication.track.stop();
        await this.room.localParticipant.unpublishTrack(
          currentMicTrackPublication.track
        );
      }

      // Create constraints for the new input device
      const audioConstraints: MediaTrackConstraints = {
        deviceId: { exact: deviceId },
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: { ideal: 1 },
      };

      // Create new audio track with the specified device
      const audioTrack = await createLocalAudioTrack(audioConstraints);

      // Publish the new microphone track
      await this.room.localParticipant.publishTrack(audioTrack, {
        name: "microphone",
        source: Track.Source.Microphone,
      });
    } catch (error) {
      console.error("Failed to change input device:", error);

      // Try to re-enable default microphone on failure
      try {
        await this.room.localParticipant.setMicrophoneEnabled(true);
      } catch (recoveryError) {
        console.error(
          "Failed to recover microphone after device switch error:",
          recoveryError
        );
      }

      throw error;
    }
  }

  public getOutputByteFrequencyData(): Uint8Array<ArrayBuffer> | null {
    if (!this.outputAnalyser) return null;

    this.outputFrequencyData ??= new Uint8Array(
      this.outputAnalyser.frequencyBinCount
    ) as Uint8Array<ArrayBuffer>;
    this.outputAnalyser.getByteFrequencyData(this.outputFrequencyData);
    return this.outputFrequencyData;
  }
}
