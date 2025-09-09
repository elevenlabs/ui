import { loadAudioConcatProcessor } from "./audioConcatProcessor";
import type { FormatConfig } from "./connection";

export class Output {
  public static async create({
    sampleRate,
    format,
    outputDeviceId,
  }: FormatConfig): Promise<Output> {
    let context: AudioContext | null = null;
    let audioElement: HTMLAudioElement | null = null;
    try {
      context = new AudioContext({ sampleRate });
      const analyser = context.createAnalyser();
      const gain = context.createGain();

      // Always create an audio element for device switching capability
      audioElement = new Audio();
      audioElement.src = "";
      audioElement.load();
      audioElement.autoplay = true;
      audioElement.style.display = "none";

      document.body.appendChild(audioElement);

      // Create media stream destination to route audio to the element
      const destination = context.createMediaStreamDestination();
      audioElement.srcObject = destination.stream;

      gain.connect(analyser);
      analyser.connect(destination);

      await loadAudioConcatProcessor(context.audioWorklet);
      const worklet = new AudioWorkletNode(context, "audio-concat-processor");
      worklet.port.postMessage({ type: "setFormat", format });
      worklet.connect(gain);

      await context.resume();

      // Set initial output device if provided
      if (outputDeviceId && audioElement.setSinkId) {
        await audioElement.setSinkId(outputDeviceId);
      }

      const newOutput = new Output(
        context,
        analyser,
        gain,
        worklet,
        audioElement
      );

      return newOutput;
    } catch (error) {
      // Clean up audio element from DOM
      if (audioElement?.parentNode) {
        audioElement.parentNode.removeChild(audioElement);
      }
      audioElement?.pause();
      if (context && context.state !== "closed") {
        await context.close();
      }

      throw error;
    }
  }

  private constructor(
    public readonly context: AudioContext,
    public readonly analyser: AnalyserNode,
    public readonly gain: GainNode,
    public readonly worklet: AudioWorkletNode,
    public readonly audioElement: HTMLAudioElement
  ) {}

  public async setOutputDevice(deviceId: string): Promise<void> {
    if (!("setSinkId" in HTMLAudioElement.prototype)) {
      throw new Error("setSinkId is not supported in this browser");
    }

    await this.audioElement.setSinkId(deviceId);
  }

  public async close() {
    // Remove audio element from DOM
    if (this.audioElement.parentNode) {
      this.audioElement.parentNode.removeChild(this.audioElement);
    }
    this.audioElement.pause();
    await this.context.close();
  }
}
