"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@elevenlabs/ui/components/button";

export function MainNav({
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // For /projects, check if pathname starts with /projects
    if (href === "/projects") {
      return pathname === "/projects" || pathname.startsWith("/projects/");
    }
    // For /members, check if pathname starts with /members
    if (href === "/members") {
      return pathname === "/members" || pathname.startsWith("/members/");
    }
    // Default exact match
    return pathname === href;
  };

  return (
    <nav className={cn("items-center gap-0.5", className)} {...props}>
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Button key={item.href} variant="ghost" asChild size="sm">
            <Link
              href={item.href}
              className={cn(
                "transition-opacity",
                active
                  ? "opacity-100 font-medium"
                  : "opacity-60 hover:opacity-100"
              )}
            >
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
