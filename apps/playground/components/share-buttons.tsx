'use client';

import { IconBrandLinkedin, IconBrandX } from '@tabler/icons-react';

import { Button } from '@elevenlabs/ui/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@elevenlabs/ui/components/tooltip';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const handleShareX = () => {
    const text = `Check out ${title}${
      description ? ` - ${description}` : ''
    } ${url}`;
    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
      text,
    )}`;
    window.open(twitterUrl, '_blank');
  };

  const handleShareLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url,
    )}`;
    window.open(linkedinUrl, '_blank');
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="size-8 shadow-none md:size-7"
              onClick={handleShareX}
            >
              <IconBrandX className="h-3.5 w-3.5" />
              <span className="sr-only">Share on X</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on X</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="size-8 shadow-none md:size-7"
              onClick={handleShareLinkedIn}
            >
              <IconBrandLinkedin className="h-3.5 w-3.5" />
              <span className="sr-only">Share on LinkedIn</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on LinkedIn</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
