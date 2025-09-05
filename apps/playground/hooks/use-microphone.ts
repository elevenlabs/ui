'use client';

import { useState, useCallback } from 'react';

export function useMicrophone() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);

  const startMicrophone = useCallback(
    async (deviceId?: string, currentMuteState = false) => {
      try {
        const constraints: MediaStreamConstraints = {
          audio: deviceId ? { deviceId: { exact: deviceId } } : true,
        };

        const mediaStream =
          await navigator.mediaDevices.getUserMedia(constraints);

        const audioTracks = mediaStream.getAudioTracks();
        audioTracks.forEach(track => {
          track.enabled = !currentMuteState;
        });

        setStream(mediaStream);
        setIsActive(true);
      } catch (err) {
        console.error('Error starting microphone:', err);
      }
    },
    [],
  );

  const stopMicrophone = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsActive(false);
    }
  }, [stream]);

  const setMuted = useCallback(
    (muted: boolean) => {
      if (stream) {
        const audioTracks = stream.getAudioTracks();
        audioTracks.forEach(track => {
          track.enabled = !muted;
        });
      }
    },
    [stream],
  );

  const switchDevice = useCallback(
    async (deviceId: string, currentMuteState = false) => {
      if (isActive) {
        stopMicrophone();
        await startMicrophone(deviceId, currentMuteState);
      }
    },
    [isActive, stopMicrophone, startMicrophone],
  );

  return {
    stream,
    isActive,
    startMicrophone,
    stopMicrophone,
    setMuted,
    switchDevice,
  };
}
