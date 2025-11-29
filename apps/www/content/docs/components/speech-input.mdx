---
title: Speech Input
description: A compact speech-to-text input component with real-time transcription using ElevenLabs Scribe.
featured: true
component: true
---

<ComponentPreview
  name="speech-input-demo"
  description="A compact speech input with real-time transcription preview"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx @elevenlabs/cli@latest components add speech-input
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install motion lucide-react
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="speech-input" title="components/ui/speech-input.tsx" />

<Step>Copy and paste the useScribe hook.</Step>

<ComponentSource name="use-scribe" title="hooks/use-scribe.ts" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  SpeechInput,
  SpeechInputCancelButton,
  SpeechInputPreview,
  SpeechInputRecordButton,
} from "@/components/ui/speech-input"
```

### Basic Usage

```tsx showLineNumbers
async function getToken() {
  const response = await fetch("/api/get-scribe-token", { method: "POST" })
  const json = await response.json()
  return json.token
}

export default function Example() {
  return (
    <SpeechInput
      getToken={getToken}
      onChange={(data) => console.log(data.transcript)}
      onStop={(data) => console.log("Final:", data.transcript)}
    >
      <SpeechInputRecordButton />
      <SpeechInputPreview placeholder="Start speaking..." />
      <SpeechInputCancelButton />
    </SpeechInput>
  )
}
```

### With Form Input

```tsx showLineNumbers
import { useState } from "react"

export default function Example() {
  const [value, setValue] = useState("")

  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 rounded border px-3 py-2"
      />
      <SpeechInput
        getToken={getToken}
        onStop={(data) => setValue((prev) => prev + " " + data.transcript)}
      >
        <SpeechInputRecordButton />
        <SpeechInputPreview />
        <SpeechInputCancelButton />
      </SpeechInput>
    </div>
  )
}
```

### Reversed Layout

The component automatically adjusts its layout based on child order:

```tsx showLineNumbers
<SpeechInput getToken={getToken}>
  <SpeechInputCancelButton />
  <SpeechInputPreview />
  <SpeechInputRecordButton />
</SpeechInput>
```

### Minimal (Record Button Only)

```tsx showLineNumbers
<SpeechInput
  getToken={getToken}
  onStop={(data) => console.log(data.transcript)}
>
  <SpeechInputRecordButton />
</SpeechInput>
```

### Custom Placeholder

```tsx showLineNumbers
<SpeechInput getToken={getToken}>
  <SpeechInputRecordButton />
  <SpeechInputPreview placeholder="Say something..." />
  <SpeechInputCancelButton />
</SpeechInput>
```

### Using the Hook

Access the speech input context in child components:

```tsx showLineNumbers
import { useSpeechInput } from "@/components/ui/speech-input"

function TranscriptDisplay() {
  const { transcript, isConnected, isConnecting } = useSpeechInput()

  return (
    <div>
      <p>
        Status:{" "}
        {isConnecting ? "Connecting" : isConnected ? "Recording" : "Idle"}
      </p>
      <p>Transcript: {transcript}</p>
    </div>
  )
}
```

### Server Action for Token

Create a server action to securely fetch the Scribe token:

```tsx title="app/actions/get-scribe-token.ts" showLineNumbers
"use server"

export async function getScribeToken() {
  const response = await fetch(
    "https://api.elevenlabs.io/v1/speech-to-text/get-realtime-token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
      },
      body: JSON.stringify({
        model_id: "scribe_v2_realtime",
        ttl_secs: 300,
      }),
    }
  )
  const data = await response.json()
  return data.token
}
```

## API Reference

### SpeechInput

The root component that manages speech-to-text state and provides context to child components.

#### Props

| Prop                    | Type                                | Default                | Description                                           |
| ----------------------- | ----------------------------------- | ---------------------- | ----------------------------------------------------- |
| children                | `ReactNode`                         | -                      | Child components (record button, preview, cancel)     |
| getToken                | `() => Promise<string>`             | -                      | Function to fetch ElevenLabs Scribe token             |
| onChange                | `(data: SpeechInputData) => void`   | -                      | Called when transcript changes                        |
| onStart                 | `(data: SpeechInputData) => void`   | -                      | Called when recording starts                          |
| onStop                  | `(data: SpeechInputData) => void`   | -                      | Called when recording stops                           |
| onCancel                | `(data: SpeechInputData) => void`   | -                      | Called when recording is cancelled                    |
| onError                 | `(error: Error \| Event) => void`   | -                      | Called on connection errors                           |
| onAuthError             | `(data: { error: string }) => void` | -                      | Called on authentication errors                       |
| onQuotaExceededError    | `(data: { error: string }) => void` | -                      | Called when quota is exceeded                         |
| modelId                 | `string`                            | `"scribe_v2_realtime"` | ElevenLabs model ID                                   |
| baseUri                 | `string`                            | -                      | Custom WebSocket base URI                             |
| commitStrategy          | `CommitStrategy`                    | `"vad"`                | How transcripts are committed (`"manual"` or `"vad"`) |
| vadSilenceThresholdSecs | `number`                            | -                      | VAD silence threshold (0.3-3.0)                       |
| vadThreshold            | `number`                            | -                      | VAD threshold (0.1-0.9)                               |
| minSpeechDurationMs     | `number`                            | -                      | Minimum speech duration (50-2000ms)                   |
| minSilenceDurationMs    | `number`                            | -                      | Minimum silence duration (50-2000ms)                  |
| languageCode            | `string`                            | -                      | ISO-639-1/3 language code                             |
| microphone              | `MicrophoneOptions`                 | See below              | Microphone configuration                              |
| audioFormat             | `AudioFormat`                       | -                      | Audio format for manual streaming                     |
| sampleRate              | `number`                            | -                      | Sample rate for manual streaming                      |
| className               | `string`                            | -                      | Optional CSS classes                                  |

#### Default Microphone Options

```tsx
{
  echoCancellation: true,
  noiseSuppression: true
}
```

### SpeechInputRecordButton

Toggle button that switches between microphone icon (idle), connecting indicator, and stop icon (recording).

#### Props

| Prop      | Type                                 | Description              |
| --------- | ------------------------------------ | ------------------------ |
| className | `string`                             | Optional CSS classes     |
| disabled  | `boolean`                            | Disable the button       |
| onClick   | `(e: MouseEvent) => void`            | Additional click handler |
| ...props  | `ComponentPropsWithoutRef<"button">` | All button props         |

### SpeechInputPreview

Displays the current transcript with smooth text animations.

#### Props

| Prop        | Type                              | Default          | Description           |
| ----------- | --------------------------------- | ---------------- | --------------------- |
| placeholder | `string`                          | `"Listening..."` | Text shown when empty |
| className   | `string`                          | -                | Optional CSS classes  |
| ...props    | `ComponentPropsWithoutRef<"div">` | -                | All div props         |

### SpeechInputCancelButton

Button to cancel the current recording and clear the transcript.

#### Props

| Prop      | Type                                 | Description              |
| --------- | ------------------------------------ | ------------------------ |
| className | `string`                             | Optional CSS classes     |
| onClick   | `(e: MouseEvent) => void`            | Additional click handler |
| ...props  | `ComponentPropsWithoutRef<"button">` | All button props         |

### useSpeechInput

Hook to access speech input context from child components.

#### Returns

| Property             | Type                  | Description                           |
| -------------------- | --------------------- | ------------------------------------- |
| isConnected          | `boolean`             | Whether currently connected/recording |
| isConnecting         | `boolean`             | Whether connection is in progress     |
| transcript           | `string`              | Full transcript (committed + partial) |
| partialTranscript    | `string`              | Current partial transcript            |
| committedTranscripts | `string[]`            | Array of committed transcripts        |
| error                | `string \| null`      | Current error message                 |
| start                | `() => Promise<void>` | Start recording                       |
| stop                 | `() => void`          | Stop recording                        |
| cancel               | `() => void`          | Cancel and clear transcript           |

### SpeechInputData

Data object passed to callbacks.

```tsx
interface SpeechInputData {
  partialTranscript: string
  committedTranscripts: string[]
  transcript: string // Combined full transcript
}
```

### CommitStrategy

```tsx
enum CommitStrategy {
  MANUAL = "manual",
  VAD = "vad",
}
```

### AudioFormat

```tsx
enum AudioFormat {
  PCM_8000 = "pcm_8000",
  PCM_16000 = "pcm_16000",
  PCM_22050 = "pcm_22050",
  PCM_24000 = "pcm_24000",
  PCM_44100 = "pcm_44100",
  PCM_48000 = "pcm_48000",
  ULAW_8000 = "ulaw_8000",
}
```

## Features

- **Real-time Transcription**: Live speech-to-text using ElevenLabs Scribe
- **Compound Components**: Flexible composition with record button, preview, and cancel
- **Animated Transitions**: Smooth expand/collapse animations using Framer Motion
- **Voice Activity Detection**: Automatic transcript commits based on speech pauses
- **Visual Feedback**: Distinct states for idle, connecting, and recording
- **Accessibility**: Proper ARIA labels and keyboard interaction

## Notes

- Requires an ElevenLabs API key for generating Scribe tokens
- Token generation should happen server-side to protect your API key
- The component automatically handles microphone permissions
- Uses WebSocket for real-time communication with ElevenLabs Scribe API
- VAD (Voice Activity Detection) mode automatically commits transcripts during pauses
- The preview component uses a gradient mask for text overflow
- Layout automatically adjusts based on whether the record button is first or last
