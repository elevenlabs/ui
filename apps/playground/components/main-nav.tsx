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
    // Check pathname immediately for initial render
    if (href === "/playground") {
      return pathname === "/playground" || pathname.startsWith("/playground/");
    }
    if (href === "/docs") {
      return pathname === "/docs" || pathname.startsWith("/docs/");
    }
    return pathname === href;
  };

  return (
    <nav className={cn("items-center gap-0.5", className)} {...props}>
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Button
            key={item.href}
            variant="link"
            asChild
            size="sm"
            className={cn(
              "transition-font-weight",
              active ? "!font-medium" : "!font-normal"
            )}
          >
            <Link
              href={item.href}
              className={cn(
                "transition-opacity ",
                active ? "opacity-100" : "opacity-60 hover:opacity-100"
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
