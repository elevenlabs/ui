---
title: Mic Selector
description: Microphone input selector with device management.
featured: true
component: true
---

<ComponentPreview
  name="mic-selector-demo"
  description="A microphone selector with live audio preview"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx @elevenlabs/cli@latest components add mic-selector
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="mic-selector" title="components/ui/mic-selector.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { MicSelector } from "@/components/ui/mic-selector"
```

### Basic Usage

```tsx showLineNumbers
<MicSelector />
```

### Controlled

```tsx showLineNumbers
const [selectedDevice, setSelectedDevice] = useState("")

<MicSelector value={selectedDevice} onValueChange={setSelectedDevice} />
```

### With Mute Control

```tsx showLineNumbers
const [selectedDevice, setSelectedDevice] = useState("")
const [isMuted, setIsMuted] = useState(false)

<MicSelector
  value={selectedDevice}
  onValueChange={setSelectedDevice}
  muted={isMuted}
  onMutedChange={setIsMuted}
/>
```

### Custom Styling

```tsx showLineNumbers
<MicSelector className="w-full max-w-md" />
```

### Using the Hook

```tsx showLineNumbers
import { useAudioDevices } from "@/components/ui/mic-selector"

const { devices, loading, error, hasPermission, loadDevices } =
  useAudioDevices()

// Access available microphones
devices.map((device) => console.log(device.label, device.deviceId))
```

## API Reference

### MicSelector

A dropdown selector for choosing audio input devices with live waveform preview.

#### Props

| Prop          | Type                         | Description                            |
| ------------- | ---------------------------- | -------------------------------------- |
| value         | `string`                     | Selected device ID (controlled)        |
| onValueChange | `(deviceId: string) => void` | Callback when device selection changes |
| muted         | `boolean`                    | Mute state (controlled)                |
| onMutedChange | `(muted: boolean) => void`   | Callback when mute state changes       |
| disabled      | `boolean`                    | Disables the selector dropdown         |
| className     | `string`                     | Optional CSS classes for the container |

### useAudioDevices

A hook for managing audio input devices.

#### Returns

| Property      | Type                  | Description                               |
| ------------- | --------------------- | ----------------------------------------- |
| devices       | `AudioDevice[]`       | Array of available audio input devices    |
| loading       | `boolean`             | Whether devices are being loaded          |
| error         | `string \| null`      | Error message if device loading failed    |
| hasPermission | `boolean`             | Whether microphone permission was granted |
| loadDevices   | `() => Promise<void>` | Function to request permission and reload |

#### AudioDevice Type

```tsx
interface AudioDevice {
  deviceId: string
  label: string
  groupId: string
}
```

## Features

- **Device Management**: Automatically detects and lists available microphones
- **Live Preview**: Real-time audio waveform visualization when dropdown is open
- **Mute Toggle**: Control preview audio on/off with controlled or uncontrolled state
- **Permission Handling**: Gracefully handles microphone permissions
- **Auto-selection**: Automatically selects first available device
- **Device Changes**: Listens for device connection/disconnection events
- **Clean Labels**: Automatically removes device metadata from labels
- **Flexible Control**: Works in both controlled and uncontrolled modes for device selection and mute state

## Notes

- Uses the `LiveWaveform` component for audio visualization
- Automatically requests microphone permissions when opening dropdown
- Preview shows scrolling waveform of microphone input
- Device list updates automatically when devices are connected/disconnected
- Works in both controlled and uncontrolled modes for device selection and mute state
- Mute state can be controlled from parent component for integration with recording controls
- Can be disabled during active recording or other operations
- Cleans up audio streams properly on unmount
