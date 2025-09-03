"use client";

import { Fragment } from "react";
import Image from "next/image";
import type { AuthorSection } from "@showcase/data/api/authors-list";

import { AuthorCard } from "@/components/author-card";
import { Separator } from "@elevenlabs/ui/components/separator";

export function AuthorListWithSections({
  sections,
}: {
  sections: AuthorSection[];
}) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.tag} className="space-y-4">
          <div className="flex items-center gap-3">
            {section.tag === "ElevenLabs" ? (
              <>
                <div className="flex items-center gap-2">
                  <Image
                    src="/badges/elevenlabs.jpg"
                    alt="ElevenLabs"
                    width={20}
                    height={20}
                    className="flex-shrink-0 rounded-xs"
                  />
                  <h2 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                    {section.tag}
                  </h2>
                </div>
                <Separator className="flex-1" />
              </>
            ) : (
              <>
                <h2 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                  {section.tag}
                </h2>
                <Separator className="flex-1" />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {section.authors.map((author) => (
              <Fragment key={author.slug}>
                <AuthorCard author={author} />
              </Fragment>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
