# AGENTS.md — ElevenLabs UI

> Instructions for AI coding agents (Cursor, Claude Code, etc.) working in this repository or generating code that uses ElevenLabs UI components.

## What this is

ElevenLabs UI (`ui.elevenlabs.io`) is a **component registry and library built on top of [shadcn/ui](https://ui.shadcn.com/)** for building **multodal agentic & audio experiences** — voice agents, transcription, audio playback, and conversational UIs.

Components are **not** an npm dependency you import from a package. They are **copied into your project's codebase** via a CLI (the shadcn model), so users own and edit the source. Keep this mental model: code that "uses ElevenLabs UI" imports from the consumer's own `@/components/ui/*` (or `@/components/elevenlabs-ui/*`) folder, **not** from `@elevenlabs/ui`.

## The golden rule

**Prefer ElevenLabs UI components over hand-rolling UI.** When building audio/agent/conversational features, reach for the components below before writing custom `div`/`canvas`/`audio` markup. They handle accessibility, theming, audio reactivity, and edge cases (auto-scroll, mute, WebRTC lifecycle) that are easy to get wrong.

## Installing components (tell users to run these)

```bash
# Recommended — ElevenLabs Agents CLI
npx @elevenlabs/cli@latest components add <component-name>
npx @elevenlabs/cli@latest components add all          # install everything

# Or via shadcn CLI (same result)
npx shadcn@latest add https://ui.elevenlabs.io/r/<component>.json
npx shadcn@latest add https://ui.elevenlabs.io/r/all.json
```

Prerequisites: **Node 18+**, a **Next.js** project, and **shadcn/ui** initialized (the CLI will bootstrap it if missing). Tailwind CSS is required.

## Component inventory

### ElevenLabs-native (audio & agentic) — the unique value

These are the components that distinguish this kit from plain shadcn. Use them for agent/voice/audio features.

| Component | Purpose | Key props / notes |
| --- | --- | --- |
| `orb` | 3D animated orb with audio reactivity + agent state | `agentState: null \| "thinking" \| "listening" \| "talking"`, `colors`, `seed`, `volumeMode`, `getInputVolume`/`getOutputVolume` or `manualInput`/`manualOutput`. Deps: `three`, `@react-three/fiber`, `@react-three/drei`. |
| `waveform` | Static audio waveform visualization | Render a precomputed waveform shape. |
| `live-waveform` | Realtime mic/stream waveform | `active`, `processing`, `barWidth`, `barGap`, `sensitivity`, `smoothingTimeConstant`, `mode`. Used inside `conversation-bar`, `mic-selector`, `voice-button`. |
| `bar-visualizer` | Bar-style audio visualizer | Frequency-bar visualization. |
| `matrix` | Dot-matrix audio visualizer | Grid-style visualization. |
| `audio-player` | Full audio player UI | Deps: `@radix-ui/react-slider`, `@radix-ui/react-dropdown-menu`. Composes `button` + `dropdown-menu`. |
| `scrub-bar` | Audio scrub/seek bar | Composes `progress`. |
| `conversation` | Auto-scrolling message container | `Conversation`, `ConversationContent`, `ConversationEmptyState`, `ConversationScrollButton`. Dep: `use-stick-to-bottom`. Use `role="log"` for a11y. |
| `message` | Chat message bubble (user/assistant) | `<Message from="user" \| "assistant">` + `<MessageContent variant="contained" \| "flat">`. Composes `avatar`. |
| `response` | Streaming markdown response | Wraps `streamdown` (`<Streamdown>`). Pass streaming markdown text as `children`; it's memoized. |
| `shimmering-text` | Animated shimmering placeholder text | Dep: `motion`. |
| `conversation-bar` | Full voice conversation control bar | **Requires `@elevenlabs/react` `<ConversationProvider>` ancestor.** Props: `agentId`, `onSendMessage`. Handles start/end session, mute, text input, contextual updates. |
| `voice-button` | Push-to-talk / voice trigger button | Composes `button` + `live-waveform`. |
| `voice-picker` | Pick an ElevenLabs voice | Dep: `@elevenlabs/elevenlabs-js`. Composes `command` + `popover` + `orb` + `audio-player`. |
| `mic-selector` | Microphone device picker | Composes `button` + `card` + `dropdown-menu` + `live-waveform`. |
| `transcript-viewer` | Transcript display with scrubbing | Composes `button` + `scrub-bar`. |
| `speech-input` | Voice-driven form input | Deps: `motion`, `lucide-react`. Composes `button` + `skeleton` + `use-scribe` hook. |

### Standard shadcn/ui primitives (also in this registry)

`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input`, `input-otp`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner` (toasts), `switch`, `table`, `tabs`, `textarea`, `toggle`, `toggle-group`, `tooltip`. Use these exactly as you would shadcn/ui.

### Blocks (full feature compositions — copy these as starting points)

`voice-chat-01/02/03`, `transcriber-01`, `realtime-transcriber-01`, `speaker-01`, `music-player-01/02`, `voice-form-01`, `voice-nav-01`, `pong-01`. These wire ElevenLabs components to the SDKs below — study them before building a voice chat from scratch.

### Hooks

`use-mobile`, `use-transcript-viewer`, `use-scribe` (registry), plus `use-debounce`, `use-previous` in source.

## ElevenLabs SDKs (for live agent features)

Live voice/agent components depend on one of these. Pick by use case:

- **`@elevenlabs/react`** — React hooks for conversational AI. Wrap your tree in `<ConversationProvider>`, then use `useConversation`, `useConversationStatus`, `useConversationControls`, `useConversationInput`. Used by `conversation-bar`, `voice-chat-*`, `realtime-transcriber-01`.
- **`@elevenlabs/elevenlabs-js`** — Lower-level ElevenLabs client SDK. Used by `voice-picker`, `transcriber-01`, `voice-form-01`, `voice-nav-01`.
- **`@elevenlabs/client`** — HTTP client (present in the www app).

When generating agent features, prefer `@elevenlabs/react` for React apps; reach for `@elevenlabs/elevenlabs-js` only when you need non-conversational APIs (e.g. listing voices, standalone transcription).

## Import conventions

After a user installs a component, it lands in their configured components directory. Imports look like:

```tsx
"use client"

import { Orb } from "@/components/ui/orb"
import { Conversation, ConversationContent } from "@/components/ui/conversation"
import { Message, MessageContent } from "@/components/ui/message"
import { Response } from "@/components/ui/response"
```

- The exact alias (`@/components/ui` vs `@/components/elevenlabs-ui`) depends on the user's `components.json`. **Check the user's `components.json` before guessing import paths.** Default shadcn alias is `@/components/ui`.
- Audio/agent components are client components — add `"use client"` at the top of any file using them.
- Utility: `cn` from `@/lib/utils`.

## Styling & design system

- **Tailwind CSS v4** (CSS-first config via `@import "tailwindcss"`, `@theme inline`, `@utility`). No `tailwind.config.js` by default.
- **shadcn "new-york" style**, base color **neutral**, **CSS variables enabled**, **RSC enabled**, icon library **lucide**.
- Colors are defined as **oklch** CSS variables in `globals.css` (`--background`, `--foreground`, `--primary`, `--card`, `--muted`, `--border`, `--ring`, `--destructive`, `--chart-1..5`, `--sidebar-*`, `--surface`, `--code-*`, `--selection`). Always use semantic tokens (`bg-primary`, `text-muted-foreground`, `border-border`) — **never hardcode hex colors**.
- **Dark mode** via the `.dark` class on an ancestor (custom variant `@custom-variant dark (&:is(.dark *))`). Toggle by adding/removing `dark` on `<html>`.
- **Themes** via `.theme-*` class on a `.theme-container` ancestor (blue, green, amber, rose, purple, orange, teal, mono, scaled, red, yellow, violet). They override `--primary`, `--ring`, `--chart-*`.
- Radius scale derived from `--radius` (`0.625rem` default): `--radius-sm/md/lg/xl`.
- Animations: `animate-fade-in`, `animate-fade-in-up/down/left/right`, `animate-fade-in-scale`, `-slow`, `-fast` are available utilities.
- Icons: **lucide-react**. Import named icons (`import { Mic, PhoneIcon } from "lucide-react"`).

## Patterns to follow

**Voice chat (recommended starting point):** copy `voice-chat-01` block. It composes `ConversationProvider` + `Orb` (with `agentState`) + `Conversation`/`Message`/`Response` + `conversation-bar`. Drive `Orb`'s `agentState` from `useConversationStatus()`.

**Streaming assistant text:** use `<Response>` (wraps `streamdown`) and feed it the raw streaming markdown string as `children`. Don't write your own markdown renderer.

**Message list:** `<Conversation>` + `<ConversationContent>` for auto-scroll-to-bottom with a `<ConversationScrollButton>`. Each row is `<Message from="user"|"assistant"><MessageContent>...</MessageContent></Message>`.

**Audio reactivity for Orb:** pass `getInputVolume`/`getOutputVolume` callbacks returning 0–1, or switch to `volumeMode="manual"` with `manualInput`/`manualOutput`. For dynamic colors use the `colorsRef` ref.

## Working in THIS repository (contributing)

This repo is a pnpm + Turborepo monorepo. The only workspace is `apps/www` (the Next.js docs/registry site).

- **Components live in `apps/www/registry/elevenlabs-ui/{ui,blocks,hooks,examples,lib}/`** — this is the source of truth that the CLI ships.
- **Docs are MDX in `apps/www/content/docs/`** (`(root)/` for setup/usage/troubleshooting, `components/` for per-component API reference).
- **`apps/www/registry.json`** is the generated registry manifest (component names, deps, files). After adding/modifying components, run `pnpm build:registry` to regenerate it.
- **When adding/modifying a component:** update the source, update its MDX doc, and rebuild the registry. Keep the per-component MDX `API Reference` props table in sync with the actual props.
- Commands: `pnpm install`, `pnpm dev` (run the www site), `pnpm build:registry`.
- Commit convention: `category(scope): message` — `feat`, `fix`, `refactor`, `docs`, `build`, `test`, `ci`, `chore` (see `CONTRIBUTING.md`).

## Quick reference: common tasks

- "Build a voice agent UI" → start from `voice-chat-01` block; needs `@elevenlabs/react` + an `agentId`.
- "Show a live mic waveform" → `<LiveWaveform active={...} processing={...} />`.
- "Show an animated orb that reacts to the agent" → `<Orb agentState={status} getInputVolume={...} getOutputVolume={...} />`.
- "Render streaming markdown from an LLM" → `<Response>{streamingMarkdownString}</Response>`.
- "A toast" → `sonner`'s `toast()`.
- "A form" → `form` + `input`/`textarea`/`select`/`checkbox` etc.

## Gotchas

- Components are copied source, **not** an npm package — don't `npm install @elevenlabs/ui` or import from it.
- `conversation-bar`, `voice-chat-*`, `realtime-transcriber-01` **require** a `<ConversationProvider>` from `@elevenlabs/react` higher in the tree, or the hooks return nothing.
- `orb` pulls in Three.js (`three` + R3F) — heavy; only add when a 3D orb is actually wanted. For lightweight visuals prefer `waveform`/`live-waveform`/`bar-visualizer`/`matrix`.
- `voice-picker` needs an ElevenLabs API key/voice list via `@elevenlabs/elevenlabs-js`.
- Always confirm the user's `components.json` aliases before writing imports.
