import { BlockDisplay } from "@/components/block-display"

export const dynamic = "force-static"
export const revalidate = false

const FEATURED_BLOCKS = [
  "voice-chat-01",
  "realtime-transcriber-01",
  "pong-01",
  "transcriber-01",
  "speaker-01",
  "voice-form-01",
  "music-player-01",
  "music-player-02",
  "voice-chat-02",
  "voice-chat-03",
]

export default async function BlocksPage() {
  return (
    <div className="flex flex-col gap-12 md:gap-24">
      {FEATURED_BLOCKS.map((name) => (
        <BlockDisplay name={name} key={name} />
      ))}
    </div>
  )
}
