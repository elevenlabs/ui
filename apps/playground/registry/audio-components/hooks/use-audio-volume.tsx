import { useEffect, useState, useRef, useCallback } from 'react';

export interface AudioAnalyserOptions {
  fftSize?: number;
  smoothingTimeConstant?: number;
  minDecibels?: number;
  maxDecibels?: number;
}

function createAudioAnalyser(
  mediaStream: MediaStream,
  options: AudioAnalyserOptions = {},
) {
  const audioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(mediaStream);
  const analyser = audioContext.createAnalyser();

  // Apply options
  if (options.fftSize) analyser.fftSize = options.fftSize;
  if (options.smoothingTimeConstant !== undefined) {
    analyser.smoothingTimeConstant = options.smoothingTimeConstant;
  }
  if (options.minDecibels !== undefined)
    analyser.minDecibels = options.minDecibels;
  if (options.maxDecibels !== undefined)
    analyser.maxDecibels = options.maxDecibels;

  source.connect(analyser);

  const cleanup = () => {
    source.disconnect();
    audioContext.close();
  };

  return { analyser, audioContext, cleanup };
}

/**
 * Hook for tracking the volume of an audio stream using the Web Audio API.
 * @param mediaStream - The MediaStream to analyze
 * @param options - Audio analyser options
 * @returns The current volume level (0-1)
 */
export function useAudioVolume(
  mediaStream?: MediaStream | null,
  options: AudioAnalyserOptions = { fftSize: 32, smoothingTimeConstant: 0 },
) {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (!mediaStream) {
      setVolume(0);
      return;
    }

    const { analyser, cleanup } = createAudioAnalyser(mediaStream, options);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const a = dataArray[i];
        sum += a * a;
      }
      setVolume(Math.sqrt(sum / dataArray.length) / 255);
    };

    const interval = setInterval(updateVolume, 1000 / 30); // 30 FPS

    return () => {
      cleanup();
      clearInterval(interval);
    };
  }, [mediaStream, JSON.stringify(options)]);

  return volume;
}

/**
 * Options for multiband volume tracking
 */
export interface MultiBandVolumeOptions {
  bands?: number;
  loPass?: number; // Low frequency cutoff
  hiPass?: number; // High frequency cutoff
  updateInterval?: number; // Update interval in ms
  analyserOptions?: AudioAnalyserOptions;
}

const multibandDefaults: MultiBandVolumeOptions = {
  bands: 5,
  loPass: 100,
  hiPass: 600,
  updateInterval: 32,
  analyserOptions: { fftSize: 2048 },
};

// Helper to normalize frequency data
const normalizeFrequencies = (frequencies: Float32Array) => {
  const normalizeDb = (value: number) => {
    const minDb = -100;
    const maxDb = -10;
    let db = 1 - (Math.max(minDb, Math.min(maxDb, value)) * -1) / 100;
    db = Math.sqrt(db);
    return db;
  };

  return frequencies.map(value => {
    if (value === -Infinity) {
      return 0;
    }
    return normalizeDb(value);
  });
};

/**
 * Hook for tracking volume across multiple frequency bands
 * @param mediaStream - The MediaStream to analyze
 * @param options - Multiband options
 * @returns Array of volume levels for each frequency band
 */
export function useMultibandVolume(
  mediaStream?: MediaStream | null,
  options: MultiBandVolumeOptions = {},
) {
  const opts = { ...multibandDefaults, ...options };
  const [frequencyBands, setFrequencyBands] = useState<number[]>(
    new Array(opts.bands).fill(0),
  );

  useEffect(() => {
    if (!mediaStream) {
      setFrequencyBands(new Array(opts.bands).fill(0));
      return;
    }

    const { analyser, cleanup } = createAudioAnalyser(
      mediaStream,
      opts.analyserOptions,
    );

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);

    const updateVolume = () => {
      analyser.getFloatFrequencyData(dataArray);
      let frequencies = new Float32Array(dataArray);
      frequencies = frequencies.slice(opts.loPass, opts.hiPass);

      const normalizedFrequencies = normalizeFrequencies(frequencies);
      const chunkSize = Math.ceil(normalizedFrequencies.length / opts.bands!);
      const chunks: number[] = [];

      for (let i = 0; i < opts.bands!; i++) {
        const summedVolumes = normalizedFrequencies
          .slice(i * chunkSize, (i + 1) * chunkSize)
          .reduce((acc, val) => acc + val, 0);
        chunks.push(summedVolumes / chunkSize);
      }

      setFrequencyBands(chunks);
    };

    const interval = setInterval(updateVolume, opts.updateInterval!);

    return () => {
      cleanup();
      clearInterval(interval);
    };
  }, [mediaStream, JSON.stringify(options)]);

  return frequencyBands;
}
