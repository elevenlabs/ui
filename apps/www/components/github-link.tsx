import { Suspense } from "react"
import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { Icons } from "@/components/icons"
import { Button } from "@/registry/elevenlabs-ui/ui/button"
import { Skeleton } from "@/registry/elevenlabs-ui/ui/skeleton"

export function GitHubLink() {
  return (
    <Button asChild size="sm" variant="ghost" className="h-8 shadow-none">
      <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
        <Icons.gitHub />
        <Suspense fallback={<Skeleton className="h-4 w-8" />}>
          <StarsCount />
        </Suspense>
      </Link>
    </Button>
  )
}

export async function StarsCount() {
  const data = await fetch("https://api.github.com/repos/elevenlabs/ui", {
    next: { revalidate: 86400 }, // Cache for 1 day (86400 seconds)
  })
  const json = await data.json()

  return (
    <span className="text-muted-foreground w-8 text-xs tabular-nums">
      {json.stargazers_count >= 1000
        ? `${(json.stargazers_count / 1000).toFixed(1)}k`
        : json.stargazers_count.toLocaleString()}
    </span>
  )
}
