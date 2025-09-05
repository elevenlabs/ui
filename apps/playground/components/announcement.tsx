import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@elevenlabs/ui/components/badge"

export function Announcement() {
  return (
    <Badge asChild variant="secondary" className="rounded-full">
      <Link href="/docs/changelog">
        Now available: Audio components crafted by ElevenLabs <ArrowRightIcon />
      </Link>
    </Badge>
  )
}
