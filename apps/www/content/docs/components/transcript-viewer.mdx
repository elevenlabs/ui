---
title: Transcript Viewer
description: A component for displaying an audio transcript with word-by-word highlighting synced to audio playback.
component: true
---

<ComponentPreview
  name="transcript-viewer-demo"
  description="An interactive transcript viewer."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx @elevenlabs/cli@latest components add transcript-viewer
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="transcript-viewer"
  title="components/ui/transcript-viewer.tsx"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  TranscriptViewerAudio,
  TranscriptViewerContainer,
  TranscriptViewerPlayPauseButton,
  TranscriptViewerScrubBar,
  TranscriptViewerWords,
} from "@/components/ui/transcript-viewer"

export function TranscriptViewerExample({ audioSrc, alignment }) {
  return (
    <TranscriptViewerContainer audioSrc={audioSrc} alignment={alignment}>
      <TranscriptViewerAudio />
      <TranscriptViewerWords />
      <div className="flex items-center gap-3">
        <TranscriptViewerPlayPauseButton />
        <TranscriptViewerScrubBar />
      </div>
    </TranscriptViewerContainer>
  )
}
```

## API Reference

### TranscriptViewerContainer

The main container for the transcript viewer components. It manages the state and provides context to its children.

| Prop               | Type                              | Description                                                                                                 |
| ------------------ | --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `audioSrc`         | `string`                          | **Required.** The URL of the audio file.                                                                    |
| `audioType`        | `AudioType`                       | **Required.** The type of the audio file. Defaults to `audio/mpeg`.                                         |
| `alignment`        | `CharacterAlignmentResponseModel` | **Required.** The alignment data for the transcript.                                                        |
| `segmentComposer`  | `SegmentComposer`                 | Optional. A function to compose transcript segments.                                                        |
| `hideAudioTags`    | `boolean`                         | Optional. If `true`, ElevenLabs tags (e.g. `[Excited]`) are hidden from the transcript. Defaults to `true`. |
| `onPlay`           | `() => void`                      | Optional. Callback when audio playback starts.                                                              |
| `onPause`          | `() => void`                      | Optional. Callback when audio playback is paused.                                                           |
| `onTimeUpdate`     | `(time: number) => void`          | Optional. Callback when the current time of the audio updates.                                              |
| `onEnded`          | `() => void`                      | Optional. Callback when the audio playback ends.                                                            |
| `onDurationChange` | `(duration: number) => void`      | Optional. Callback when the audio duration is available.                                                    |

### TranscriptViewerWords

Displays the transcript words. It uses the context from `TranscriptViewerContainer` to highlight words as the audio plays.

| Prop             | Type                                                                                            | Description                                              |
| ---------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `renderWord`     | `(props: { word: TranscriptWord, status: "spoken" \| "unspoken" \| "current" }) => ReactNode`   | Optional. Custom render function for each word.          |
| `renderGap`      | `(props: { segment: TranscriptGap, status: "spoken" \| "unspoken" \| "current" }) => ReactNode` | Optional. Custom render function for gaps between words. |
| `wordClassNames` | `string`                                                                                        | Optional. Additional class names for each word `<span>`. |
| `gapClassNames`  | `string`                                                                                        | Optional. Additional class names for each gap `<span>`.  |

### TranscriptViewerAudio

The underlying HTML `<audio>` element. It's controlled by the `TranscriptViewerContainer`. You can pass standard `<audio>` element props. By default it is hidden.

### TranscriptViewerPlayPauseButton

A button to play or pause the audio. It uses the context from `TranscriptViewerContainer`. It accepts props for the `Button` component.

### TranscriptViewerScrubBar

A scrub bar for seeking through the audio timeline. It's a context-aware implementation of the `ScrubBar` component.

| Prop                | Type      | Description                                                                               |
| ------------------- | --------- | ----------------------------------------------------------------------------------------- |
| `showTimeLabels`    | `boolean` | Optional. If `true`, displays current time and remaining time labels. Defaults to `true`. |
| `labelsClassName`   | `string`  | Optional. Class names for the time labels container.                                      |
| `trackClassName`    | `string`  | Optional. Class names for the scrub bar track.                                            |
| `progressClassName` | `string`  | Optional. Class names for the scrub bar progress indicator.                               |
| `thumbClassName`    | `string`  | Optional. Class names for the scrub bar thumb.                                            |

### useTranscriptViewerContext

A hook to access the transcript viewer's state and controls. Must be used within a `TranscriptViewerContainer`.

Returns an object with the following properties:

- `audioRef`: Ref to the audio element.
- `alignment`: The provided alignment data.
- `segments`: All transcript segments.
- `words`: All word segments.
- `spokenSegments`: Segments that have been spoken.
- `unspokenSegments`: Segments that have not been spoken.
- `currentWord`: The currently spoken word segment.
- `currentSegmentIndex`: The index of the current segment.
- `currentWordIndex`: The index of the current word.
- `duration`: The total duration of the audio.
- `currentTime`: The current playback time.
- `isPlaying`: `true` if audio is playing.
- `isScrubbing`: `true` if the user is scrubbing.
- `play()`: Function to start playback.
- `pause()`: Function to pause playback.
- `seekToTime(time)`: Function to seek to a specific time.
- `seekToWord(word)`: Function to seek to a specific word.
- `startScrubbing()`: Function to call on scrub start.
- `endScrubbing()`: Function to call on scrub end.

### useTranscriptViewer

A headless hook to manage a transcript viewer's state, controls, and playback. This is used internally by the `TranscriptViewer` components.

Accepts an object with the following properties:

| Prop               | Type                              | Description                                                                                                 |
| ------------------ | --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `alignment`        | `CharacterAlignmentResponseModel` | **Required.** The alignment data for the transcript.                                                        |
| `segmentComposer`  | `SegmentComposer`                 | Optional. A function to compose transcript segments.                                                        |
| `hideAudioTags`    | `boolean`                         | Optional. If `true`, ElevenLabs tags (e.g. `[Excited]`) are hidden from the transcript. Defaults to `true`. |
| `onPlay`           | `() => void`                      | Optional. Callback when audio playback starts.                                                              |
| `onPause`          | `() => void`                      | Optional. Callback when audio playback is paused.                                                           |
| `onTimeUpdate`     | `(time: number) => void`          | Optional. Callback when the current time of the audio updates.                                              |
| `onEnded`          | `() => void`                      | Optional. Callback when the audio playback ends.                                                            |
| `onDurationChange` | `(duration: number) => void`      | Optional. Callback when the audio duration is available.                                                    |

Returns an object with the following properties:

- `audioRef`: Ref to the audio element.
- `segments`: All transcript segments.
- `words`: All word segments.
- `spokenSegments`: Segments that have been spoken.
- `unspokenSegments`: Segments that have not been spoken.
- `currentWord`: The currently spoken word segment.
- `currentSegmentIndex`: The index of the current segment.
- `currentWordIndex`: The index of the current word.
- `duration`: The total duration of the audio.
- `currentTime`: The current playback time.
- `isPlaying`: `true` if audio is playing.
- `isScrubbing`: `true` if the user is scrubbing.
- `play()`: Function to start playback.
- `pause()`: Function to pause playback.
- `seekToTime(time)`: Function to seek to a specific time.
- `seekToWord(word)`: Function to seek to a specific word.
- `startScrubbing()`: Function to call on scrub start.
- `endScrubbing()`: Function to call on scrub end.
