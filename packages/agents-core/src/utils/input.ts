import { loadRawAudioProcessor } from "./rawAudioProcessor";
import type { FormatConfig } from "./connection";
import { isIosDevice } from "./compatibility";

export type InputConfig = {
  preferHeadphonesForIosDevices?: boolean;
  inputDeviceId?: string;
};

const LIBSAMPLERATE_JS =
  "https://cdn.jsdelivr.net/npm/@alexanderolsen/libsamplerate-js@2.1.2/dist/libsamplerate.worklet.js";

const defaultConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  // Automatic gain control helps maintain a steady volume level with microphones: https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings/autoGainControl
  autoGainControl: true,
  // Mono audio for better echo cancellation
  channelCount: { ideal: 1 },
};

export class Input {
  public static async create({
    sampleRate,
    format,
    preferHeadphonesForIosDevices,
    inputDeviceId,
  }: FormatConfig & InputConfig): Promise<Input> {
    let context: AudioContext | null = null;
    let inputStream: MediaStream | null = null;

    try {
      const options: MediaTrackConstraints = {
        sampleRate: { ideal: sampleRate },
        ...defaultConstraints,
      };

      if (isIosDevice() && preferHeadphonesForIosDevices) {
        const availableDevices =
          await window.navigator.mediaDevices.enumerateDevices();
        const idealDevice = availableDevices.find(
          d =>
            // cautious to include "bluetooth" in the search
            // as might trigger bluetooth speakers
            d.kind === "audioinput" &&
            ["airpod", "headphone", "earphone"].find(keyword =>
              d.label.toLowerCase().includes(keyword)
            )
        );
        if (idealDevice) {
          options.deviceId = { ideal: idealDevice.deviceId };
        }
      }

      if (inputDeviceId) {
        options.deviceId = { exact: inputDeviceId };
      }

      const supportsSampleRateConstraint =
        navigator.mediaDevices.getSupportedConstraints().sampleRate;

      context = new window.AudioContext(
        supportsSampleRateConstraint ? { sampleRate } : {}
      );
      const analyser = context.createAnalyser();
      if (!supportsSampleRateConstraint) {
        await context.audioWorklet.addModule(LIBSAMPLERATE_JS);
      }
      await loadRawAudioProcessor(context.audioWorklet);

      const constraints = { voiceIsolation: true, ...options };
      inputStream = await navigator.mediaDevices.getUserMedia({
        audio: constraints,
      });

      const source = context.createMediaStreamSource(inputStream);
      const worklet = new AudioWorkletNode(context, "raw-audio-processor");
      worklet.port.postMessage({ type: "setFormat", format, sampleRate });

      source.connect(analyser);
      analyser.connect(worklet);

      await context.resume();

      return new Input(context, analyser, worklet, inputStream, source);
    } catch (error) {
      inputStream?.getTracks().forEach(track => {
        track.stop();
      });
      context?.close();
      throw error;
    }
  }

  private constructor(
    public readonly context: AudioContext,
    public readonly analyser: AnalyserNode,
    public readonly worklet: AudioWorkletNode,
    public inputStream: MediaStream,
    private mediaStreamSource: MediaStreamAudioSourceNode
  ) {}

  public async close() {
    this.inputStream.getTracks().forEach(track => {
      track.stop();
    });
    this.mediaStreamSource.disconnect();
    await this.context.close();
  }

  public setMuted(isMuted: boolean) {
    this.worklet.port.postMessage({ type: "setMuted", isMuted });
  }

  public async setInputDevice(inputDeviceId: string): Promise<void> {
    if (!inputDeviceId) {
      throw new Error("Input device ID is required");
    }

    try {
      // Create new constraints with the specified device
      const options: MediaTrackConstraints = {
        deviceId: { exact: inputDeviceId },
        ...defaultConstraints,
      };

      const constraints = { voiceIsolation: true, ...options };

      // Get new media stream with the specified device
      const newInputStream = await navigator.mediaDevices.getUserMedia({
        audio: constraints,
      });

      // Stop old tracks and disconnect old source
      this.inputStream.getTracks().forEach(track => {
        track.stop();
      });
      this.mediaStreamSource.disconnect();

      // Replace the stream and create new source
      this.inputStream = newInputStream;
      this.mediaStreamSource =
        this.context.createMediaStreamSource(newInputStream);

      // Reconnect the audio graph
      this.mediaStreamSource.connect(this.analyser);
    } catch (error) {
      console.error("Failed to switch input device:", error);
      throw error;
    }
  }
}
