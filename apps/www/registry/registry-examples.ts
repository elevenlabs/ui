import { type Registry } from "shadcn/schema"

export const examples: Registry["items"] = [
  {
    name: "audio-player-demo",
    type: "registry:example",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/audio-player.json",
      "button",
      "card",
      "scroll-area",
    ],
    files: [
      {
        path: "examples/audio-player-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "orb-demo",
    type: "registry:example",
    registryDependencies: ["https://ui.elevenlabs.io/r/orb.json", "button"],
    files: [
      {
        path: "examples/orb-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "waveform-demo",
    type: "registry:example",
    registryDependencies: ["https://ui.elevenlabs.io/r/waveform.json"],
    files: [
      {
        path: "examples/waveform-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "live-waveform-demo",
    type: "registry:example",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/live-waveform.json",
      "button",
    ],
    files: [
      {
        path: "examples/live-waveform-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "bar-visualizer-demo",
    type: "registry:example",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/bar-visualizer.json",
      "button",
    ],
    files: [
      {
        path: "examples/bar-visualizer-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "matrix-demo",
    type: "registry:example",
    registryDependencies: ["https://ui.elevenlabs.io/r/matrix.json"],
    files: [
      {
        path: "examples/matrix-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "message-demo",
    type: "registry:example",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/message.json",
      "https://ui.elevenlabs.io/r/response.json",
    ],
    files: [
      {
        path: "examples/message-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "response-demo",
    type: "registry:example",
    registryDependencies: ["https://ui.elevenlabs.io/r/response.json"],
    files: [
      {
        path: "examples/response-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "shimmering-text-demo",
    type: "registry:example",
    registryDependencies: ["https://ui.elevenlabs.io/r/shimmering-text.json"],
    files: [
      {
        path: "examples/shimmering-text-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "voice-picker-demo",
    type: "registry:example",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/voice-picker.json",
      "https://ui.elevenlabs.io/r/audio-player.json",
    ],
    files: [
      {
        path: "examples/voice-picker-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "voice-button-demo",
    type: "registry:example",
    registryDependencies: ["https://ui.elevenlabs.io/r/voice-button.json"],
    files: [
      {
        path: "examples/voice-button-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "conversation-bar-demo",
    type: "registry:example",
    registryDependencies: ["https://ui.elevenlabs.io/r/conversation-bar.json"],
    files: [
      {
        path: "examples/conversation-bar-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "mic-selector-demo",
    type: "registry:example",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/mic-selector.json",
      "https://ui.elevenlabs.io/r/live-waveform.json",
      "button",
      "card",
      "separator",
    ],
    files: [
      {
        path: "examples/mic-selector-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "conversation-demo",
    type: "registry:example",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/message.json",
      "https://ui.elevenlabs.io/r/response.json",
      "https://ui.elevenlabs.io/r/conversation.json",
    ],
    files: [
      {
        path: "examples/conversation-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "transcript-viewer-demo",
    type: "registry:example",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/transcript-viewer.json",
      "https://ui.elevenlabs.io/r/scrub-bar.json",
    ],
    files: [
      {
        path: "examples/transcript-viewer-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "scrub-bar-demo",
    type: "registry:example",
    registryDependencies: ["https://ui.elevenlabs.io/r/scrub-bar.json"],
    files: [
      {
        path: "examples/scrub-bar-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "speech-input-demo",
    type: "registry:example",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/speech-input.json",
      "input",
      "textarea",
    ],
    files: [
      {
        path: "examples/speech-input-demo.tsx",
        type: "registry:example",
      },
    ],
  },
]
