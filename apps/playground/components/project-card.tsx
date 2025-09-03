"use client";

import * as React from "react";
import Link from "next/link";
import { getCategoryById } from "@showcase/data/categories";
import { Code2, Globe, Play } from "lucide-react";

import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { CategoryPill } from "@/components/category-pill";
import { LoadingImage } from "@/components/loading-image";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@elevenlabs/ui/components/avatar";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@elevenlabs/ui/components/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@elevenlabs/ui/components/tooltip";

/**
 * ProjectCard (preserves original bottom segmented links)
 * - No hardcoded colors (uses tokens like border, ring, muted, etc.)
 * - Image fills full width, rounded, with subtle hover zoom
 * - Card hover state (shadow + ring accent)
 * - Bottom actions match original segmented style (not buttons)
 */
export function ProjectCard({ project }: { project: Project }) {
  const cover = project.image ?? "/default-project-image.png";

  const actions = (
    [
      project.demoUrl && {
        label: "Live demo",
        href: project.demoUrl,
        icon: Globe,
      },
      project.repoUrl && {
        label: "Code",
        href: project.repoUrl,
        icon: Code2,
      },
      project.videoUrl && {
        label: "Video",
        href: project.videoUrl,
        icon: Play,
      },
    ].filter(Boolean) as {
      label: string;
      href: string;
      icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    }[]
  ).slice(0, 3);

  const cols =
    actions.length === 3
      ? "grid-cols-3"
      : actions.length === 2
        ? "grid-cols-2"
        : "grid-cols-1";

  return (
    <Card className="group relative isolate flex h-full flex-col overflow-hidden rounded-lg pt-0 hover:cursor-pointer">
      {/* Overlay link across the card, content layers above via z-index */}
      <Link
        href={`/projects/p/${project.slug}`}
        aria-label={project.title}
        className="focus-visible:ring-ring absolute inset-0 z-10 rounded-lg focus-visible:ring-2 focus-visible:outline-none"
      >
        <span className="sr-only">View {project.title} project</span>
      </Link>

      {/* Header */}
      <CardHeader className="relative gap-3 px-1 pt-1 pb-0">
        <LoadingImage
          src={cover}
          alt={project.title}
          containerClassName="ring-border ring-1 rounded overflow-hidden"
          className="group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </CardHeader>

      {/* Content */}
      <CardContent className="relative flex-1 space-y-4 pt-0">
        <div className="min-w-0">
          <CardTitle className="text-xl leading-tight tracking-tight">
            <span className="relative inline-flex items-center gap-2">
              {project.title}
            </span>
          </CardTitle>
          {project.description ? (
            <CardDescription className="mt-1 line-clamp-3">
              {project.description}
            </CardDescription>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3">
          {!!project.categories?.length && (
            <div className="relative z-30 flex flex-wrap items-center gap-2">
              {project.categories.slice(0, 3).map((categoryId) => {
                const category = getCategoryById(categoryId);
                return (
                  <CategoryPill
                    key={categoryId}
                    iconSrc={category?.iconSrc}
                    href={category?.extHref}
                    asLink={true}
                  >
                    {category?.name || categoryId}
                  </CategoryPill>
                );
              })}
            </div>
          )}

          {/* Authors */}
          {project.authors?.length ? (
            <CardAction className="relative z-30">
              <TooltipProvider>
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {project.authors.slice(0, 4).map((a, i) => {
                      const authorId = project.authorIds[i];
                      const initials = a.name
                        .split(" ")
                        .map((p) => p[0] ?? "")
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();

                      const avatarNode = (
                        <div className="ring-border bg-muted relative h-7 w-7 overflow-hidden rounded-full ring-1">
                          <Avatar className="h-7 w-7">
                            {a.avatar ? (
                              <AvatarImage
                                src={a.avatar}
                                alt={a.name}
                                className="object-cover"
                              />
                            ) : (
                              <AvatarFallback className="bg-muted text-[10px]">
                                {initials}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </div>
                      );

                      return (
                        <Tooltip key={`${a.name}-${i}`}>
                          <TooltipTrigger asChild>
                            {authorId ? (
                              <Link
                                href={`/members/${authorId}`}
                                aria-label={a.name}
                                className="relative z-30 focus:outline-none"
                              >
                                {avatarNode}
                              </Link>
                            ) : (
                              <span>{avatarNode}</span>
                            )}
                          </TooltipTrigger>
                          <TooltipContent className="px-2 py-1 text-xs">
                            {a.name}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                  {project.authors.length > 4 && (
                    <span className="bg-muted text-muted-foreground ml-2 rounded-full px-1.5 py-0.5 text-[10px] leading-none">
                      +{project.authors.length - 4}
                    </span>
                  )}
                </div>
              </TooltipProvider>
            </CardAction>
          ) : null}
        </div>
      </CardContent>

      {/* Footer (Segmented Actions like original) */}
      {actions.length > 0 && (
        <div className="relative z-30 mt-auto -mb-6 border-t">
          <div
            className={cn(
              "text-muted-foreground grid w-full text-xs sm:text-sm",
              cols
            )}
          >
            {actions.map((a, idx) => (
              <Link
                key={`${a.label}-${idx}`}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "hover:text-foreground flex items-center justify-center gap-1 py-2 transition-colors sm:gap-2 sm:py-3",
                  idx > 0 && "border-l"
                )}
              >
                <a.icon className="h-4 w-4" />
                <span>{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Card hover ring accent */}
      <div className="group-hover:ring-ring pointer-events-none absolute inset-0 rounded-lg ring-0 transition-[box-shadow] ring-inset group-hover:ring-1" />
    </Card>
  );
}
