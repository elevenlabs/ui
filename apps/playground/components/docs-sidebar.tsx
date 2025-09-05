"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { showMcpDocs } from "@/lib/flags"
import type { source } from "@/lib/source"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@elevenlabs/ui/components/sidebar"

const TOP_LEVEL_SECTIONS = [
  { name: "Get Started", href: "/docs" },
  {
    name: "Components",
    href: "/docs/components",
  },
  {
    name: "Registry",
    href: "/docs/registry",
  },
  {
    name: "MCP Server",
    href: "/docs/mcp",
  },
]
const EXCLUDED_SECTIONS = ["installation", "dark-mode"]
const EXCLUDED_PAGES = ["/docs"]

export function DocsSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tree: typeof source.pageTree }) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel>Sections</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {TOP_LEVEL_SECTIONS.map(({ name, href }) => {
                if (!showMcpDocs && href.includes("/mcp")) {
                  return null
                }
                const isActive =
                  href === "/docs"
                    ? pathname === href
                    : pathname.startsWith(href)
                
                return (
                  <SidebarMenuItem key={name}>
                    <SidebarMenuButton
                      tooltip={name}
                      isActive={isActive}
                      asChild
                    >
                      <Link href={href}>
                        <span>{name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {tree.children.map((item) => {
          if (EXCLUDED_SECTIONS.includes(item.$id ?? "")) {
            return null
          }

          return (
            <SidebarGroup key={item.$id}>
              <SidebarGroupLabel>{item.name}</SidebarGroupLabel>
              <SidebarGroupContent className="flex flex-col gap-2">
                {item.type === "folder" && (
                  <SidebarMenu>
                    {item.children.map((item) => {
                      if (
                        !showMcpDocs &&
                        item.type === "page" &&
                        item.url?.includes("/mcp")
                      ) {
                        return null
                      }

                      return (
                        item.type === "page" &&
                        !EXCLUDED_PAGES.includes(item.url) && (
                          <SidebarMenuItem key={item.url}>
                            <SidebarMenuButton
                              tooltip={typeof item.name === 'string' ? item.name : undefined}
                              isActive={item.url === pathname}
                              asChild
                            >
                              <Link href={item.url}>
                                <span>{item.name}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      )
                    })}
                  </SidebarMenu>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
    </Sidebar>
  )
}
