"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import type { AuthorWithProjectCount } from "@showcase/data/api/authors-list";
import { GalleryVerticalEnd, MapPin } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@elevenlabs/ui/components/avatar";
import { Card } from "@elevenlabs/ui/components/card";

export function AuthorCard({ author }: { author: AuthorWithProjectCount }) {
  const initials = author.name
    .split(" ")
    .map((p) => p[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const cardContent = (
    <Card className="group hover:border-primary/20 relative overflow-hidden transition-all hover:shadow-md">
      <div className="px-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <Avatar className="ring-border h-11 w-11 ring-1">
            {author.avatar ? (
              <AvatarImage src={author.avatar} alt={author.name} />
            ) : (
              <AvatarFallback className="text-sm">{initials}</AvatarFallback>
            )}
          </Avatar>

          {/* Info */}
          <div className="min-w-0 flex-1">
            {/* Name with badges */}
            <div className="mb-1 flex items-center gap-1">
              <h3 className="group-hover:text-primary truncate text-[15px] font-medium transition-colors">
                {author.name}
              </h3>
              {author.isElevenLabs && (
                <Image
                  src="/badges/elevenlabs.jpg"
                  alt="ElevenLabs"
                  width={16}
                  height={16}
                  className="flex-shrink-0 rounded-xs invert dark:invert-0"
                />
              )}
              {/* Twitter Verified Badge - shown for all users */}
              <svg
                className="h-4 w-4 flex-shrink-0 fill-current text-blue-500"
                viewBox="0 0 24 24"
              >
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
              </svg>
            </div>

            {/* Bio */}
            {author.bio && (
              <p className="text-muted-foreground mb-2 line-clamp-2 text-xs">
                {author.bio}
              </p>
            )}

            {/* Bottom row: projects and location */}
            <div className="text-muted-foreground flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <GalleryVerticalEnd className="h-3 w-3" />
                <span>{author.projectCount}</span>
              </div>

              {author.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{author.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <Link href={`/members/${author.slug}`} className="block">
      {cardContent}
    </Link>
  );
}
