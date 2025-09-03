"use client";

import { cn } from "@/lib/utils";
import { Separator } from "@elevenlabs/ui/components/separator";

export function ElevenLabsLogo({
  size = 64,
  className,
  text,
}: {
  size?: number;
  className?: string;
  text?: string | boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "group relative flex items-center gap-4 rounded-2xl px-0 py-2",

        className
      )}
    >
      {/* Logo */}
      <div
        className="relative flex items-center justify-center rounded-2xl"
        style={{ width: size, height: size }}
      >
        <div
          className="absolute inset-0 -z-10 rounded-2xl"
          style={{
            background:
              "radial-gradient(75% 75% at 50% 50%, hsl(var(--primary) / 0.35) 0%, hsl(var(--primary) / 0.18) 35%, hsl(var(--primary) / 0.06) 65%, transparent 75%)",
            filter: "blur(10px)",
          }}
        />
        <svg
          viewBox="0 0 24 24"
          className="text-foreground h-[70%] w-[70%] drop-shadow-[0_2px_10px_hsl(var(--foreground)/0.25)]"
          fill="currentColor"
        >
          <rect x="6" y="4" width="4" height="16" rx="0.2" />
          <rect x="14" y="4" width="4" height="16" rx="0.2" />
        </svg>
      </div>

      {/* Text */}
      {text && (
        <>
          <Separator orientation="vertical" className="mx-0 !h-12" />

          <h1 className="text-secondary-foreground text-2xl font-medium tracking-tight">
            {text}
          </h1>
        </>
      )}
    </div>
  );
}
