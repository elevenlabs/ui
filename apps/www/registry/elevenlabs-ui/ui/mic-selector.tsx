"use client"

import { useCallback, useEffect, useState } from "react"
import { Check, ChevronsUpDown, Mic, MicOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/elevenlabs-ui/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/elevenlabs-ui/ui/dropdown-menu"
import { LiveWaveform } from "@/registry/elevenlabs-ui/ui/live-waveform"

export interface AudioDevice {
  deviceId: string
  label: string
  groupId: string
}

export interface MicSelectorProps {
  value?: string
  onValueChange?: (deviceId: string) => void
  muted?: boolean
  onMutedChange?: (muted: boolean) => void
  disabled?: boolean
  className?: string
}

export function MicSelector({
  value,
  onValueChange,
  muted,
  onMutedChange,
  disabled,
  className,
}: MicSelectorProps) {
  const { devices, loading, error, hasPermission, loadDevices } =
    useAudioDevices()
  const [selectedDevice, setSelectedDevice] = useState<string>(value || "")
  const [internalMuted, setInternalMuted] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Use controlled muted if provided, otherwise use internal state
  const isMuted = muted !== undefined ? muted : internalMuted

  // Update internal state when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedDevice(value)
    }
  }, [value])

  // Select first device by default
  const defaultDeviceId = devices[0]?.deviceId || ""
  useEffect(() => {
    if (!selectedDevice && defaultDeviceId) {
      const newDevice = defaultDeviceId
      setSelectedDevice(newDevice)
      onValueChange?.(newDevice)
    }
  }, [defaultDeviceId, selectedDevice, onValueChange])

  const currentDevice = devices.find((d) => d.deviceId === selectedDevice) ||
    devices[0] || {
      label: loading ? "Loading..." : "No microphone",
      deviceId: "",
    }

  const handleDeviceSelect = (deviceId: string, e?: React.MouseEvent) => {
    e?.preventDefault()
    setSelectedDevice(deviceId)
    onValueChange?.(deviceId)
  }

  const handleDropdownOpenChange = async (open: boolean) => {
    setIsDropdownOpen(open)
    if (open && !hasPermission && !loading) {
      await loadDevices()
    }
  }

  const toggleMute = () => {
    const newMuted = !isMuted
    if (muted === undefined) {
      setInternalMuted(newMuted)
    }
    onMutedChange?.(newMuted)
  }

  const isPreviewActive = isDropdownOpen && !isMuted

  return (
    <DropdownMenu onOpenChange={handleDropdownOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "hover:bg-accent flex w-40 min-w-0 shrink cursor-pointer items-center gap-1.5 sm:w-48",
            className
          )}
          disabled={loading || disabled}
        >
          {isMuted ? (
            <MicOff className="h-4 w-4 flex-shrink-0" />
          ) : (
            <Mic className="h-4 w-4 flex-shrink-0" />
          )}
          <span className="min-w-0 flex-1 truncate text-left text-xs sm:text-sm">
            {currentDevice.label}
          </span>
          <ChevronsUpDown className="h-3 w-3 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="top" className="w-72">
        {loading ? (
          <DropdownMenuItem disabled>Loading devices...</DropdownMenuItem>
        ) : error ? (
          <DropdownMenuItem disabled>Error: {error}</DropdownMenuItem>
        ) : (
          devices.map((device) => (
            <DropdownMenuItem
              key={device.deviceId}
              onClick={(e) => handleDeviceSelect(device.deviceId, e)}
              onSelect={(e) => e.preventDefault()}
              className="flex items-center justify-between"
            >
              <span className="truncate">{device.label}</span>
              {selectedDevice === device.deviceId && (
                <Check className="h-4 w-4 flex-shrink-0" />
              )}
            </DropdownMenuItem>
          ))
        )}
        {devices.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="flex items-center gap-2 p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  toggleMute()
                }}
                className="h-8 gap-2"
              >
                {isMuted ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
                <span className="text-sm">{isMuted ? "Unmute" : "Mute"}</span>
              </Button>
              <div className="bg-accent ml-auto w-16 overflow-hidden rounded-md p-1.5">
                <LiveWaveform
                  active={isPreviewActive}
                  deviceId={selectedDevice || defaultDeviceId}
                  mode="static"
                  height={15}
                  barWidth={3}
                  barGap={1}
                />
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function useAudioDevices() {
  const [devices, setDevices] = useState<AudioDevice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState(false)

  const loadDevicesWithoutPermission = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const deviceList = await navigator.mediaDevices.enumerateDevices()

      const audioInputs = deviceList
        .filter((device) => device.kind === "audioinput")
        .map((device) => {
          let cleanLabel =
            device.label || `Microphone ${device.deviceId.slice(0, 8)}`
          cleanLabel = cleanLabel.replace(/\s*\([^)]*\)/g, "").trim()

          return {
            deviceId: device.deviceId,
            label: cleanLabel,
            groupId: device.groupId,
          }
        })

      setDevices(audioInputs)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get audio devices"
      )
      console.error("Error getting audio devices:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadDevicesWithPermission = useCallback(async () => {
    if (loading) return

    try {
      setLoading(true)
      setError(null)

      const tempStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
      tempStream.getTracks().forEach((track) => track.stop())

      const deviceList = await navigator.mediaDevices.enumerateDevices()

      const audioInputs = deviceList
        .filter((device) => device.kind === "audioinput")
        .map((device) => {
          let cleanLabel =
            device.label || `Microphone ${device.deviceId.slice(0, 8)}`
          cleanLabel = cleanLabel.replace(/\s*\([^)]*\)/g, "").trim()

          return {
            deviceId: device.deviceId,
            label: cleanLabel,
            groupId: device.groupId,
          }
        })

      setDevices(audioInputs)
      setHasPermission(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get audio devices"
      )
      console.error("Error getting audio devices:", err)
    } finally {
      setLoading(false)
    }
  }, [loading])

  useEffect(() => {
    loadDevicesWithoutPermission()
  }, [loadDevicesWithoutPermission])

  useEffect(() => {
    const handleDeviceChange = () => {
      if (hasPermission) {
        loadDevicesWithPermission()
      } else {
        loadDevicesWithoutPermission()
      }
    }

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange)

    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange
      )
    }
  }, [hasPermission, loadDevicesWithPermission, loadDevicesWithoutPermission])

  return {
    devices,
    loading,
    error,
    hasPermission,
    loadDevices: loadDevicesWithPermission,
  }
}
