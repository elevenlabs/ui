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
  items: { href: string; label: string; includeSubPaths?: boolean }[];
}) {
  const pathname = usePathname();

  const isActive = (href: string, includeSubPaths?: boolean) => {
    if (includeSubPaths) {
      return pathname === href || pathname.startsWith(`${href}/`);
    }
    return pathname === href;
  };

  return (
    <nav className={cn("items-center gap-0.5", className)} {...props}>
      {items.map((item) => {
        const active = isActive(item.href, item.includeSubPaths);
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
