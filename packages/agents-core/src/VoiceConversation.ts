import { arrayBufferToBase64, base64ToArrayBuffer } from "./utils/audio";
import { Input, type InputConfig } from "./utils/input";
import { Output } from "./utils/output";
import { createConnection } from "./utils/ConnectionFactory";
import type { BaseConnection, FormatConfig } from "./utils/BaseConnection";
import { WebRTCConnection } from "./utils/WebRTCConnection";
import type { AgentAudioEvent, InterruptionEvent } from "./utils/events";
import { applyDelay } from "./utils/applyDelay";
import {
  BaseConversation,
  type Options,
  type PartialOptions,
} from "./BaseConversation";
import { WebSocketConnection } from "./utils/WebSocketConnection";

export class VoiceConversation extends BaseConversation {
  public static async startSession(
    options: PartialOptions
  ): Promise<VoiceConversation> {
    const fullOptions = BaseConversation.getFullOptions(options);

    if (fullOptions.onStatusChange) {
      fullOptions.onStatusChange({ status: "connecting" });
    }
    if (fullOptions.onCanSendFeedbackChange) {
      fullOptions.onCanSendFeedbackChange({ canSendFeedback: false });
    }

    let input: Input | null = null;
    let connection: BaseConnection | null = null;
    let output: Output | null = null;
    let preliminaryInputStream: MediaStream | null = null;

    let wakeLock: WakeLockSentinel | null = null;
    if (options.useWakeLock ?? true) {
      try {
        wakeLock = await navigator.wakeLock.request("screen");
      } catch (_e) {
        // Wake Lock is not required for the conversation to work
      }
    }

    try {
      // some browsers won't allow calling getSupportedConstraints or enumerateDevices
      // before getting approval for microphone access
      preliminaryInputStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      await applyDelay(fullOptions.connectionDelay);
      connection = await createConnection(options);
      [input, output] = await Promise.all([
        Input.create({
          ...connection.inputFormat,
          preferHeadphonesForIosDevices: options.preferHeadphonesForIosDevices,
          inputDeviceId: options.inputDeviceId,
        }),
        Output.create({
          ...connection.outputFormat,
          outputDeviceId: options.outputDeviceId,
        }),
      ]);

      preliminaryInputStream?.getTracks().forEach(track => {
        track.stop();
      });
      preliminaryInputStream = null;

      return new VoiceConversation(
        fullOptions,
        connection,
        input,
        output,
        wakeLock
      );
    } catch (error) {
      if (fullOptions.onStatusChange) {
        fullOptions.onStatusChange({ status: "disconnected" });
      }
      preliminaryInputStream?.getTracks().forEach(track => {
        track.stop();
      });
      connection?.close();
      await input?.close();
      await output?.close();
      try {
        await wakeLock?.release();
        wakeLock = null;
      } catch (_e) {}
      throw error;
    }
  }

  private inputFrequencyData?: Uint8Array<ArrayBuffer>;
  private outputFrequencyData?: Uint8Array<ArrayBuffer>;

  protected constructor(
    options: Options,
    connection: BaseConnection,
    public input: Input,
    public output: Output,
    public wakeLock: WakeLockSentinel | null
  ) {
    super(options, connection);
    this.input.worklet.port.onmessage = this.onInputWorkletMessage;
    this.output.worklet.port.onmessage = this.onOutputWorkletMessage;
  }

  protected override async handleEndSession() {
    await super.handleEndSession();
    try {
      await this.wakeLock?.release();
      this.wakeLock = null;
    } catch (_e) {}

    await this.input.close();
    await this.output.close();
  }

  protected override handleInterruption(event: InterruptionEvent) {
    super.handleInterruption(event);
    this.fadeOutAudio();
  }

  protected override handleAudio(event: AgentAudioEvent) {
    if (this.lastInterruptTimestamp <= event.audio_event.event_id) {
      this.options.onAudio?.(event.audio_event.audio_base_64);

      // Only play audio through the output worklet for WebSocket connections
      // WebRTC connections handle audio playback directly through LiveKit tracks
      if (!(this.connection instanceof WebRTCConnection)) {
        this.addAudioBase64Chunk(event.audio_event.audio_base_64);
      }

      this.currentEventId = event.audio_event.event_id;
      this.updateCanSendFeedback();
      this.updateMode("speaking");
    }
  }

  private onInputWorkletMessage = (event: MessageEvent): void => {
    const rawAudioPcmData = event.data[0];

    // TODO: When supported, maxVolume can be used to avoid sending silent audio
    // const maxVolume = event.data[1];

    if (this.status === "connected") {
      this.connection.sendMessage({
        user_audio_chunk: arrayBufferToBase64(rawAudioPcmData.buffer),
      });
    }
  };

  private onOutputWorkletMessage = ({ data }: MessageEvent): void => {
    if (data.type === "process") {
      this.updateMode(data.finished ? "listening" : "speaking");
    }
  };

  private addAudioBase64Chunk = (chunk: string) => {
    this.output.gain.gain.value = this.volume;
    this.output.worklet.port.postMessage({ type: "clearInterrupted" });
    this.output.worklet.port.postMessage({
      type: "buffer",
      buffer: base64ToArrayBuffer(chunk),
    });
  };

  private fadeOutAudio = () => {
    // mute agent
    this.updateMode("listening");
    this.output.worklet.port.postMessage({ type: "interrupt" });
    this.output.gain.gain.exponentialRampToValueAtTime(
      0.0001,
      this.output.context.currentTime + 2
    );

    // reset volume back
    setTimeout(() => {
      this.output.gain.gain.value = this.volume;
      this.output.worklet.port.postMessage({ type: "clearInterrupted" });
    }, 2000); // Adjust the duration as needed
  };

  private calculateVolume = (frequencyData: Uint8Array) => {
    if (frequencyData.length === 0) {
      return 0;
    }

    // TODO: Currently this averages all frequencies, but we should probably
    // bias towards the frequencies that are more typical for human voice
    let volume = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      volume += frequencyData[i] / 255;
    }
    volume /= frequencyData.length;

    return volume < 0 ? 0 : volume > 1 ? 1 : volume;
  };

  public setMicMuted(isMuted: boolean) {
    // Use LiveKit track muting for WebRTC connections
    if (this.connection instanceof WebRTCConnection) {
      this.connection.setMicMuted(isMuted);
    } else {
      // Use input muting for WebSocket connections
      this.input.setMuted(isMuted);
    }
  }

  public getInputByteFrequencyData(): Uint8Array<ArrayBuffer> {
    this.inputFrequencyData ??= new Uint8Array(
      this.input.analyser.frequencyBinCount
    ) as Uint8Array<ArrayBuffer>;
    this.input.analyser.getByteFrequencyData(this.inputFrequencyData);
    return this.inputFrequencyData;
  }

  public getOutputByteFrequencyData(): Uint8Array<ArrayBuffer> {
    // Use WebRTC analyser if available
    if (this.connection instanceof WebRTCConnection) {
      const webrtcData = this.connection.getOutputByteFrequencyData();
      if (webrtcData) {
        return webrtcData as Uint8Array<ArrayBuffer>;
      }
      // Fallback to empty array if WebRTC analyser not ready
      return new Uint8Array(1024) as Uint8Array<ArrayBuffer>;
    }

    this.outputFrequencyData ??= new Uint8Array(
      this.output.analyser.frequencyBinCount
    ) as Uint8Array<ArrayBuffer>;
    this.output.analyser.getByteFrequencyData(this.outputFrequencyData);
    return this.outputFrequencyData;
  }

  public getInputVolume() {
    return this.calculateVolume(this.getInputByteFrequencyData());
  }

  public getOutputVolume() {
    return this.calculateVolume(this.getOutputByteFrequencyData());
  }

  public async changeInputDevice({
    sampleRate,
    format,
    preferHeadphonesForIosDevices,
    inputDeviceId,
  }: FormatConfig & InputConfig): Promise<Input> {
    try {
      // For WebSocket connections, try to change device on existing input first
      if (this.connection instanceof WebSocketConnection) {
        if (inputDeviceId) {
          try {
            await this.input.setInputDevice(inputDeviceId);
            return this.input;
          } catch (error) {
            console.warn(
              "Failed to change device on existing input, recreating:",
              error
            );
            // Fall back to recreating the input
          }
        }
      }

      // Handle WebRTC connections differently
      if (this.connection instanceof WebRTCConnection) {
        if (inputDeviceId) {
          await this.connection.setAudioInputDevice(inputDeviceId);
        }
      }

      // Fallback: recreate the input
      await this.input.close();

      const newInput = await Input.create({
        sampleRate,
        format,
        preferHeadphonesForIosDevices,
        inputDeviceId,
      });

      this.input = newInput;

      return this.input;
    } catch (error) {
      console.error("Error changing input device", error);
      throw error;
    }
  }

  public async changeOutputDevice({
    sampleRate,
    format,
    outputDeviceId,
  }: FormatConfig): Promise<Output> {
    try {
      // For WebSocket connections, try to change device on existing output first
      if (this.connection instanceof WebSocketConnection) {
        if (outputDeviceId) {
          try {
            await this.output.setOutputDevice(outputDeviceId);
            return this.output;
          } catch (error) {
            console.warn(
              "Failed to change device on existing output, recreating:",
              error
            );
            // Fall back to recreating the output
          }
        }
      }

      // Handle WebRTC connections differently
      if (this.connection instanceof WebRTCConnection) {
        if (outputDeviceId) {
          await this.connection.setAudioOutputDevice(outputDeviceId);
        }
      }

      // Fallback: recreate the output
      await this.output.close();

      const newOutput = await Output.create({
        sampleRate,
        format,
        outputDeviceId,
      });

      this.output = newOutput;

      return this.output;
    } catch (error) {
      console.error("Error changing output device", error);
      throw error;
    }
  }

  public setVolume = ({ volume }: { volume: number }) => {
    // clamp & coerce
    const clampedVolume = Number.isFinite(volume)
      ? Math.min(1, Math.max(0, volume))
      : 1;
    this.volume = clampedVolume;

    if (this.connection instanceof WebRTCConnection) {
      // For WebRTC connections, control volume via HTML audio elements
      this.connection.setAudioVolume(clampedVolume);
    } else {
      // For WebSocket connections, control volume via gain node
      this.output.gain.gain.value = clampedVolume;
    }
  };
}
