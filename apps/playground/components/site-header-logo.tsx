"use client";

import Link from "next/link";

import { Icons } from "@/components/icons";
import { Separator } from "@elevenlabs/ui/components/separator";

interface SiteHeaderLogoProps {
  siteName: string;
}

export function SiteHeaderLogo({ siteName }: SiteHeaderLogoProps) {
  return (
    <div className="hidden h-10 md:flex">
      <Link href="/" className="flex items-center gap-2 font-medium">
        <Icons.elevenlabs className="size-22" />
        <Separator orientation="vertical" className="h-4" />
        <span>Agents SDK</span>
        <span className="sr-only">{siteName}</span>
      </Link>
    </div>
  );
}
