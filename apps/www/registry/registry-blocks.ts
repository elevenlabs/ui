import { type Registry } from "shadcn/schema"

export const blocks: Registry["items"] = [
  {
    name: "speaker-01",
    description: "EL-01 Speaker",
    type: "registry:block",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/audio-player.json",
      "https://ui.elevenlabs.io/r/orb.json",
      "https://ui.elevenlabs.io/r/waveform.json",
      "button",
      "card",
    ],
    files: [
      {
        path: "blocks/speaker-01/page.tsx",
        type: "registry:page",
        target: "app/speaker/page.tsx",
      },
      {
        path: "blocks/speaker-01/components/speaker.tsx",
        type: "registry:component",
        target: "components/speaker.tsx",
      },
    ],
    meta: {
      iframeHeight: "900px",
      container:
        "w-full bg-surface min-h-svh flex px-4 py-12 items-center md:py-20 justify-center min-w-0",
      mobile: "component",
    },
    categories: ["audio"],
  },
  {
    name: "transcriber-01",
    description: "Transcriber",
    type: "registry:block",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/live-waveform.json",
      "button",
      "card",
      "scroll-area",
      "separator",
    ],
    dependencies: ["@elevenlabs/elevenlabs-js", "streamdown"],
    files: [
      {
        path: "blocks/transcriber-01/page.tsx",
        type: "registry:page",
        target: "app/transcriber-01/page.tsx",
      },
      {
        path: "blocks/transcriber-01/actions/transcribe.ts",
        type: "registry:file",
        target: "app/transcriber-01/actions/transcribe.ts",
      },
    ],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-4 py-12 items-center md:py-20 justify-center min-w-0",
      mobile: "component",
    },
    categories: ["audio"],
  },
  {
    name: "realtime-transcriber-01",
    description: "Scribe V2 Realtime Transcriber",
    type: "registry:block",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/voice-button.json",
      "button",
      "scroll-area",
      "https://ui.elevenlabs.io/r/shimmering-text.json",
    ],
    dependencies: ["streamdown"],
    files: [
      {
        path: "blocks/realtime-transcriber-01/page.tsx",
        type: "registry:page",
        target: "app/realtime-transcriber-01/page.tsx",
      },
    ],
    meta: {
      iframeHeight: "800px",
      container:
        "w-full bg-surface min-h-svh flex px-4 py-12 items-center md:py-20 justify-center min-w-0",
      mobile: "component",
    },
    categories: ["audio"],
  },
  {
    name: "voice-chat-01",
    description: "Voice chat 1",
    type: "registry:block",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/orb.json",
      "https://ui.elevenlabs.io/r/shimmering-text.json",
      "button",
      "card",
      "https://ui.elevenlabs.io/r/message.json",
      "https://ui.elevenlabs.io/r/response.json",
      "https://ui.elevenlabs.io/r/conversation.json",
      "scroll-area",
    ],
    dependencies: ["@elevenlabs/react"],
    files: [
      {
        path: "blocks/voice-chat-01/page.tsx",
        type: "registry:page",
        target: "app/voice-chat/page.tsx",
      },
    ],
    meta: {
      iframeHeight: "800px",
      container:
        "w-full bg-surface min-h-svh flex px-4 py-12 items-center md:py-20 justify-center min-w-0",
      mobile: "component",
    },
    categories: ["agents"],
  },
  {
    name: "voice-chat-02",
    description: "Voice chat 2",
    type: "registry:block",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/orb.json",
      "https://ui.elevenlabs.io/r/shimmering-text.json",
      "button",
      "card",
    ],
    dependencies: ["@elevenlabs/react", "framer-motion"],
    files: [
      {
        path: "blocks/voice-chat-02/page.tsx",
        type: "registry:page",
        target: "app/voice-chat/page.tsx",
      },
    ],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-4 py-12 items-center md:py-20 justify-center min-w-0",
      mobile: "component",
    },
    categories: ["agents"],
  },
  {
    name: "voice-chat-03",
    description: "Voice chat 3",
    type: "registry:block",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/conversation-bar.json",
      "https://ui.elevenlabs.io/r/conversation.json",
      "https://ui.elevenlabs.io/r/message.json",
      "https://ui.elevenlabs.io/r/orb.json",
      "https://ui.elevenlabs.io/r/response.json",
      "tooltip",
      "card",
      "button",
    ],
    dependencies: ["@elevenlabs/react"],
    files: [
      {
        path: "blocks/voice-chat-03/page.tsx",
        type: "registry:page",
        target: "app/voice-chat/page.tsx",
      },
    ],
    meta: {
      iframeHeight: "800px",
      container:
        "w-full bg-surface min-h-svh flex px-4 py-12 items-center md:py-20 justify-center min-w-0",
      mobile: "component",
    },
    categories: ["agents"],
  },
  {
    name: "music-player-01",
    description: "Music player with playlist",
    type: "registry:block",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/audio-player.json",
      "button",
      "scroll-area",
    ],
    files: [
      {
        path: "blocks/music-player-01/page.tsx",
        type: "registry:page",
        target: "app/music-player/page.tsx",
      },
    ],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-4 py-12 items-center md:py-20 justify-center min-w-0",
      mobile: "component",
    },
    categories: ["audio"],
  },
  {
    name: "music-player-02",
    description: "Simple music player",
    type: "registry:block",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/audio-player.json",
      "card",
    ],
    files: [
      {
        path: "blocks/music-player-02/page.tsx",
        type: "registry:page",
        target: "app/music-player/page.tsx",
      },
    ],
    meta: {
      iframeHeight: "400px",
      container:
        "w-full bg-surface min-h-svh flex px-4 py-12 items-center md:py-20 justify-center min-w-0",
      mobile: "component",
    },
    categories: ["audio"],
  },
  {
    name: "voice-form-01",
    description: "Voice-fill form",
    type: "registry:block",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/voice-button.json",
      "https://ui.elevenlabs.io/r/live-waveform.json",
      "button",
      "card",
      "form",
      "input",
    ],
    dependencies: ["@elevenlabs/elevenlabs-js", "ai", "zod"],
    files: [
      {
        path: "blocks/voice-form-01/page.tsx",
        type: "registry:page",
        target: "app/voice-form/page.tsx",
      },
      {
        path: "blocks/voice-form-01/schema.ts",
        type: "registry:file",
        target: "app/voice-form/schema.ts",
      },
      {
        path: "blocks/voice-form-01/actions/voice-to-form.ts",
        type: "registry:file",
        target: "app/voice-form/actions/voice-to-form.ts",
      },
    ],
    meta: {
      iframeHeight: "700px",
      container:
        "w-full bg-surface min-h-svh flex px-4 py-12 items-center md:py-20 justify-center min-w-0",
      mobile: "component",
    },
    categories: ["audio"],
  },
  {
    name: "voice-nav-01",
    description: "Voice-nav site navigation",
    type: "registry:block",
    registryDependencies: [
      "https://ui.elevenlabs.io/r/voice-button.json",
      "button",
      "card",
    ],
    dependencies: ["@elevenlabs/elevenlabs-js", "ai", "zod"],
    files: [
      {
        path: "blocks/voice-nav-01/page.tsx",
        type: "registry:page",
        target: "app/voice-nav/page.tsx",
      },
      {
        path: "blocks/voice-nav-01/actions/voice-to-site.ts",
        type: "registry:file",
        target: "app/voice-nav/actions/voice-to-site.ts",
      },
    ],
    meta: {
      iframeHeight: "900px",
      container:
        "w-full bg-surface min-h-svh flex px-4 py-12 items-center md:py-20 justify-center min-w-0",
      mobile: "component",
    },
    categories: ["audio"],
  },
  {
    name: "pong-01",
    description: "Retro Pong game with Matrix display",
    type: "registry:block",
    registryDependencies: ["https://ui.elevenlabs.io/r/matrix.json", "card"],
    dependencies: ["@upstash/redis"],
    files: [
      {
        path: "blocks/pong-01/page.tsx",
        type: "registry:page",
        target: "app/pong/page.tsx",
      },
      {
        path: "blocks/pong-01/components/pong-game.tsx",
        type: "registry:component",
        target: "components/pong-game.tsx",
      },
      {
        path: "blocks/pong-01/components/player-indicator.tsx",
        type: "registry:component",
        target: "components/player-indicator.tsx",
      },
      {
        path: "blocks/pong-01/components/game-engine.ts",
        type: "registry:file",
        target: "lib/game-engine.ts",
      },
      {
        path: "blocks/pong-01/components/sound-manager.ts",
        type: "registry:file",
        target: "lib/sound-manager.ts",
      },
      {
        path: "blocks/pong-01/actions.ts",
        type: "registry:file",
        target: "actions/pong-actions.ts",
      },
    ],
    meta: {
      iframeHeight: "700px",
      container:
        "w-full bg-surface min-h-svh flex px-4 py-12 items-center md:py-20 justify-center min-w-0",
      mobile: "component",
    },
    categories: ["audio"],
  },
]
