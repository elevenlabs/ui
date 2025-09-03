import Image from "next/image";
import Link from "next/link";

import { Button } from "@elevenlabs/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@elevenlabs/ui/components/dialog";
import { PageActions } from "@/components/global-page-header";

export function ShowcaseCTA() {
  return (
    <PageActions>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">Nominate a Project</Button>
        </DialogTrigger>
        <DialogContent className="overflow-hidden p-0 sm:max-w-[525px]">
          <div className="relative h-48 w-full">
            <Image
              src="/swag.png"
              alt="ElevenLabs Swag - Backpack, T-shirt, and accessories"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">Nominate a Project</DialogTitle>
              <DialogDescription asChild>
                <div className="space-y-4 pt-2">
                  <p className="text-base">
                    Share your project built with ElevenLabs and join our
                    showcase. If your submission is approved, you will receive
                    some limited-edition swag.
                  </p>
                  <div className="bg-muted/50 space-y-2 rounded-lg p-4">
                    <p className="text-sm font-medium">
                      How to submit your project:
                    </p>
                    <ol className="ml-4 space-y-1 text-sm">
                      <li>1. Fork this repository on GitHub</li>
                      <li>
                        2. Create your project MDX file following our template
                      </li>
                      <li>
                        3. Submit a pull request with your project details
                      </li>
                    </ol>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button asChild className="flex-1">
                      <Link
                        href="https://github.com/elevenlabs/showcase/blob/main/.github/CONTRIBUTING.md"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Submit Project on GitHub
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/projects">Browse Projects</Link>
                    </Button>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </div>
        </DialogContent>
      </Dialog>
      <Button asChild size="sm" variant="ghost">
        <Link href="/projects">View Projects</Link>
      </Button>
    </PageActions>
  );
}
