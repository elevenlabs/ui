import { type Registry } from "shadcn/schema"

export const ui: Registry["items"] = [
  {
    name: "orb",
    type: "registry:ui",
    dependencies: [
      "@react-three/drei",
      "@react-three/fiber",
      "three",
      "@types/three",
    ],
    files: [
      {
        path: "ui/orb.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "waveform",
    type: "registry:ui",
    files: [
      {
        path: "ui/waveform.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "live-waveform",
    type: "registry:ui",
    files: [
      {
        path: "ui/live-waveform.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "shimmering-text",
    type: "registry:ui",
    dependencies: ["motion"],
    files: [
      {
        path: "ui/shimmering-text.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "audio-player",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slider", "@radix-ui/react-dropdown-menu"],
    registryDependencies: ["button", "dropdown-menu"],
    files: [
      {
        path: "ui/audio-player.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "message",
    type: "registry:ui",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["avatar"],
    files: [
      {
        path: "ui/message.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "conversation",
    type: "registry:ui",
    dependencies: ["use-stick-to-bottom"],
    registryDependencies: ["button"],
    files: [
      {
        path: "ui/conversation.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "response",
    type: "registry:ui",
    dependencies: ["streamdown"],
    files: [
      {
        path: "ui/response.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "bar-visualizer",
    type: "registry:ui",
    files: [
      {
        path: "ui/bar-visualizer.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "matrix",
    type: "registry:ui",
    files: [
      {
        path: "ui/matrix.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "voice-picker",
    type: "registry:ui",
    dependencies: ["@elevenlabs/elevenlabs-js"],
    registryDependencies: [
      "button",
      "badge",
      "command",
      "popover",
      "https://ui.elevenlabs.io/r/orb.json",
      "https://ui.elevenlabs.io/r/audio-player.json",
    ],
    files: [
      {
        path: "ui/voice-picker.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "voice-button",
    type: "registry:ui",
    registryDependencies: [
      "button",
      "https://ui.elevenlabs.io/r/live-waveform.json",
    ],
    files: [
      {
        path: "ui/voice-button.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "conversation-bar",
    type: "registry:ui",
    registryDependencies: [
      "button",
      "https://ui.elevenlabs.io/r/live-waveform.json",
      "card",
      "separator",
      "textarea",
    ],
    dependencies: ["@elevenlabs/react"],
    files: [
      {
        path: "ui/conversation-bar.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "mic-selector",
    type: "registry:ui",
    registryDependencies: [
      "button",
      "card",
      "dropdown-menu",
      "https://ui.elevenlabs.io/r/live-waveform.json",
    ],
    files: [
      {
        path: "ui/mic-selector.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "transcript-viewer",
    type: "registry:ui",
    registryDependencies: [
      "button",
      "https://ui.elevenlabs.io/r/scrub-bar.json",
    ],
    devDependencies: ["@elevenlabs/elevenlabs-js"],
    files: [
      {
        path: "ui/transcript-viewer.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "scrub-bar",
    type: "registry:ui",
    registryDependencies: ["progress"],
    files: [
      {
        path: "ui/scrub-bar.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "speech-input",
    type: "registry:ui",
    dependencies: ["motion", "lucide-react"],
    registryDependencies: [
      "button",
      "skeleton",
      "https://ui.elevenlabs.io/r/use-scribe.json",
    ],
    files: [
      {
        path: "ui/speech-input.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "frame",
    type: "registry:ui",
    files: [
      {
        path: "ui/frame.tsx",
        type: "registry:ui",
      },
    ],
    cssVars: {
      theme: {
        "--fvw": "1vw",
        "--fvh": "1vh",
        "--5fvw": "calc(5 * var(--fvw))",
        "--10fvw": "calc(10 * var(--fvw))",
        "--15fvw": "calc(15 * var(--fvw))",
        "--20fvw": "calc(20 * var(--fvw))",
        "--25fvw": "calc(25 * var(--fvw))",
        "--30fvw": "calc(30 * var(--fvw))",
        "--35fvw": "calc(35 * var(--fvw))",
        "--40fvw": "calc(40 * var(--fvw))",
        "--45fvw": "calc(45 * var(--fvw))",
        "--50fvw": "calc(50 * var(--fvw))",
        "--55fvw": "calc(55 * var(--fvw))",
        "--60fvw": "calc(60 * var(--fvw))",
        "--65fvw": "calc(65 * var(--fvw))",
        "--70fvw": "calc(70 * var(--fvw))",
        "--75fvw": "calc(75 * var(--fvw))",
        "--80fvw": "calc(80 * var(--fvw))",
        "--85fvw": "calc(85 * var(--fvw))",
        "--90fvw": "calc(90 * var(--fvw))",
        "--95fvw": "calc(95 * var(--fvw))",
        "--100fvw": "calc(100 * var(--fvw))",
        "--5fvh": "calc(5 * var(--fvh))",
        "--10fvh": "calc(10 * var(--fvh))",
        "--15fvh": "calc(15 * var(--fvh))",
        "--20fvh": "calc(20 * var(--fvh))",
        "--25fvh": "calc(25 * var(--fvh))",
        "--30fvh": "calc(30 * var(--fvh))",
        "--35fvh": "calc(35 * var(--fvh))",
        "--40fvh": "calc(40 * var(--fvh))",
        "--45fvh": "calc(45 * var(--fvh))",
        "--50fvh": "calc(50 * var(--fvh))",
        "--55fvh": "calc(55 * var(--fvh))",
        "--60fvh": "calc(60 * var(--fvh))",
        "--65fvh": "calc(65 * var(--fvh))",
        "--70fvh": "calc(70 * var(--fvh))",
        "--75fvh": "calc(75 * var(--fvh))",
        "--80fvh": "calc(80 * var(--fvh))",
        "--85fvh": "calc(85 * var(--fvh))",
        "--90fvh": "calc(90 * var(--fvh))",
        "--95fvh": "calc(95 * var(--fvh))",
        "--100fvh": "calc(100 * var(--fvh))",
      },
    },
  },
]
