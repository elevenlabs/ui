"use client";

import { Icons } from "@/components/icons";
import { useAudioDevices } from "@/hooks/use-audio-devices";
import { useMicrophone } from "@/hooks/use-microphone";
import { Button } from "@elevenlabs/ui/components/button";
import { Card } from "@elevenlabs/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@elevenlabs/ui/components/dropdown-menu";
import { Check, ChevronsUpDown, Mic, MicOff } from "lucide-react";
import { useState } from "react";

export function ConversationBar() {
  const { devices, loading, error } = useAudioDevices();
  const { isActive, startMicrophone, stopMicrophone, switchDevice, setMuted } =
    useMicrophone();
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [isMuted, setIsMuted] = useState(false);

  // Set the default selected device to the first one when devices load
  const defaultDeviceId = devices[0]?.deviceId || "";
  if (!selectedDevice && defaultDeviceId) {
    setSelectedDevice(defaultDeviceId);
  }

  const currentDevice = loading
    ? { label: "Loading...", deviceId: "" }
    : devices.find((d) => d.deviceId === selectedDevice) ||
      devices[0] || { label: "No microphone", deviceId: "" };

  const handleDeviceSelect = async (deviceId: string) => {
    setSelectedDevice(deviceId);
    if (isActive) {
      await switchDevice(deviceId, isMuted);
    }
  };

  const handleDropdownOpenChange = async (open: boolean) => {
    if (open && !isActive) {
      // Start microphone when dropdown opens with current mute state
      await startMicrophone(selectedDevice || defaultDeviceId, isMuted);
    } else if (!open && isActive) {
      // Stop microphone when dropdown closes
      stopMicrophone();
    }
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    setMuted(newMuteState);
  };

  return (
    <div className="flex justify-center p-4">
      <Card className="shadow-lg border p-2 m-0">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="default"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Icons.orb className="size-5" />
            <span>Start conversation</span>
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
                devices.map((device) => (
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
                    onClick={(e) => {
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
                    <span>{isMuted ? "Off" : "On"}</span>
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
