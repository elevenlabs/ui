'use client';

import { useEffect, useState } from 'react';

export interface AudioDevice {
  deviceId: string;
  label: string;
  groupId: string;
}

export function useAudioDevices() {
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getAudioDevices() {
      try {
        setLoading(true);
        setError(null);

        const tempStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        tempStream.getTracks().forEach(track => track.stop());

        const deviceList = await navigator.mediaDevices.enumerateDevices();

        const audioInputs = deviceList
          .filter(device => device.kind === 'audioinput')
          .map(device => {
            let cleanLabel =
              device.label || `Microphone ${device.deviceId.slice(0, 8)}`;

            // Remove anything in parentheses
            cleanLabel = cleanLabel.replace(/\s*\([^)]*\)/g, '').trim();

            return {
              deviceId: device.deviceId,
              label: cleanLabel,
              groupId: device.groupId,
            };
          });

        setDevices(audioInputs);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to get audio devices',
        );
        console.error('Error getting audio devices:', err);
      } finally {
        setLoading(false);
      }
    }

    getAudioDevices();

    const handleDeviceChange = () => {
      getAudioDevices();
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        handleDeviceChange,
      );
    };
  }, []);

  return { devices, loading, error };
}
