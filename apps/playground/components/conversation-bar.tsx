'use client';

import { Icons } from '@/components/icons';
import { useAudioDevices } from '@/hooks/use-audio-devices';
import { Button } from '@elevenlabs/ui/components/button';
import { Card } from '@elevenlabs/ui/components/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@elevenlabs/ui/components/dropdown-menu';
import { Check, ChevronsUpDown, Mic, MicOff } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface AudioLevelBarProps {
  isActive: boolean;
  isMuted: boolean;
  deviceId?: string;
}

function AudioLevelBar({ isActive, isMuted, deviceId }: AudioLevelBarProps) {
  const [level, setLevel] = useState(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const audioContextRef = useRef<AudioContext | undefined>(undefined);
  const analyserRef = useRef<AnalyserNode | undefined>(undefined);
  const streamRef = useRef<MediaStream | undefined>(undefined);

  useEffect(() => {
    if (!isActive || isMuted) {
      setLevel(0);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = undefined;
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== 'closed'
      ) {
        audioContextRef.current.close();
        audioContextRef.current = undefined;
      }
      return;
    }

    const setupAudioAnalysis = async () => {
      try {
        const constraints: MediaStreamConstraints = {
          audio: deviceId ? { deviceId: { exact: deviceId } } : true,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.3;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.fftSize);

        const updateLevel = () => {
          if (!analyserRef.current) return;

          analyserRef.current.getByteTimeDomainData(dataArray);

          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const normalized = (dataArray[i] - 128) / 128;
            sum += normalized * normalized;
          }
          const rms = Math.sqrt(sum / dataArray.length);
          const normalizedLevel = Math.min(100, Math.round(rms * 100 * 3));

          setLevel(normalizedLevel);
          animationFrameRef.current = requestAnimationFrame(updateLevel);
        };

        updateLevel();
      } catch (error) {
        console.error('Failed to setup audio analysis:', error);
      }
    };

    setupAudioAnalysis();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== 'closed'
      ) {
        audioContextRef.current.close();
      }
    };
  }, [isActive, isMuted, deviceId]);

  return (
    <div className="flex items-center gap-2 ml-auto">
      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-100 ease-out rounded-full"
          style={{ width: `${level}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right">
        {level}
      </span>
    </div>
  );
}

export function ConversationBar() {
  const { devices, loading, error, hasPermission, loadDevices } =
    useAudioDevices();
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isMuted, setIsMuted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPreviewActive, setIsPreviewActive] = useState(false);

  const defaultDeviceId = devices[0]?.deviceId || '';
  if (!selectedDevice && defaultDeviceId) {
    setSelectedDevice(defaultDeviceId);
  }

  const currentDevice = loading
    ? { label: 'Loading...', deviceId: '' }
    : devices.find(d => d.deviceId === selectedDevice) ||
      devices[0] || { label: 'No microphone', deviceId: '' };

  const handleDeviceSelect = async (deviceId: string) => {
    setSelectedDevice(deviceId);
  };

  const handleDropdownOpenChange = async (open: boolean) => {
    setIsDropdownOpen(open);

    if (open) {
      if (!hasPermission && !loading) {
        await loadDevices();
      }
      if (!isConversationActive) {
        setIsPreviewActive(true);
      }
    } else {
      if (!isConversationActive) {
        setIsPreviewActive(false);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isConversationActive && isDropdownOpen) {
      setIsPreviewActive(isMuted);
    }
  };

  const handleStartConversation = async () => {
    try {
      setIsStarting(true);

      if (!hasPermission && !loading) {
        await loadDevices();
      }

      const newConversationState = !isConversationActive;
      setIsConversationActive(newConversationState);

      if (newConversationState) {
        setIsPreviewActive(false);
      }
    } finally {
      setIsStarting(false);
    }
  };

  const isAudioActive = isConversationActive || isPreviewActive;

  return (
    <div className="flex justify-center p-4">
      <Card className="shadow-lg border p-2 m-0">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="default"
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleStartConversation}
            disabled={isStarting}
          >
            <Icons.orb className="size-5" />
            <span>{isConversationActive ? 'Stop' : 'Start'} conversation</span>
          </Button>

          <DropdownMenu onOpenChange={handleDropdownOpenChange}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5 w-48 hover:bg-transparent border-0 cursor-pointer"
                disabled={loading}
              >
                {isMuted ? (
                  <MicOff className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <Mic className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="truncate flex-1 text-left">
                  {currentDevice.label}
                </span>
                <ChevronsUpDown className="h-3 w-3 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="top" className="w-64">
              {loading ? (
                <DropdownMenuItem disabled>Loading devices...</DropdownMenuItem>
              ) : error ? (
                <DropdownMenuItem disabled>Error: {error}</DropdownMenuItem>
              ) : (
                devices.map(device => (
                  <DropdownMenuItem
                    key={device.deviceId}
                    onClick={() => handleDeviceSelect(device.deviceId)}
                    className="flex items-center justify-between"
                  >
                    <span>{device.label}</span>
                    {selectedDevice === device.deviceId && (
                      <Check className="h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))
              )}
              {devices.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={e => {
                      e.preventDefault();
                      toggleMute();
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {isMuted ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                    <span>{isMuted ? 'Off' : 'On'}</span>
                    <AudioLevelBar
                      isActive={isAudioActive}
                      isMuted={isMuted}
                      deviceId={selectedDevice || defaultDeviceId}
                    />
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </div>
  );
}
