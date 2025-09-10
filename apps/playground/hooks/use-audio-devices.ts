'use client';

import { useState, useCallback, useEffect } from 'react';

export interface AudioDevice {
  deviceId: string;
  label: string;
  groupId: string;
}

export function useAudioDevices() {
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const loadDevicesWithoutPermission = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

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
  }, []);

  const loadDevicesWithPermission = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      // Request permission to get detailed device names
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
      setHasPermission(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to get audio devices',
      );
      console.error('Error getting audio devices:', err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Load devices without permission on mount
  useEffect(() => {
    loadDevicesWithoutPermission();
  }, [loadDevicesWithoutPermission]);

  // Listen for device changes
  useEffect(() => {
    const handleDeviceChange = () => {
      if (hasPermission) {
        loadDevicesWithPermission();
      } else {
        loadDevicesWithoutPermission();
      }
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        handleDeviceChange,
      );
    };
  }, [hasPermission, loadDevicesWithPermission, loadDevicesWithoutPermission]);

  return {
    devices,
    loading,
    error,
    hasPermission,
    loadDevices: loadDevicesWithPermission,
  };
}
