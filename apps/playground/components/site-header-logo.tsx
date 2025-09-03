"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@elevenlabs/ui/components/button";
import { Separator } from "@elevenlabs/ui/components/separator";

interface SiteHeaderLogoProps {
  siteName: string;
}

export function SiteHeaderLogo({ siteName }: SiteHeaderLogoProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="hidden h-10 lg:flex">
      <Link href="/" className="flex items-center gap-2 font-medium">
        <Icons.logo className="size-6" />
        <Separator orientation="vertical" className="h-4" />
        <span className={cn(isHomePage ? "opacity-100" : "opacity-75")}>
          Agents
        </span>
        <span className="sr-only">{siteName}</span>
      </Link>
    </div>
  );
}
