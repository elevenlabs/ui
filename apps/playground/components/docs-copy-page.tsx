'use client';

import { IconCheck, IconChevronDown, IconCopy } from '@tabler/icons-react';

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Button } from '@elevenlabs/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@elevenlabs/ui/components/dropdown-menu';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '@elevenlabs/ui/components/popover';
import { Separator } from '@elevenlabs/ui/components/separator';

function getPromptUrl(baseURL: string, url: string) {
  return `${baseURL}?q=${encodeURIComponent(
    `I’m looking at an ElevenLabs project: ${url}.
Help me understand how it works & how I would recreate it using the ElevenLabs API.
  `,
  )}`;
}

const menuItems = {
  markdown: (url: string) => (
    <a href={`${url}.md`} target="_blank" rel="noopener noreferrer">
      <svg strokeLinejoin="round" viewBox="0 0 22 16">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.5 2.25H2.5C1.80964 2.25 1.25 2.80964 1.25 3.5V12.5C1.25 13.1904 1.80964 13.75 2.5 13.75H19.5C20.1904 13.75 20.75 13.1904 20.75 12.5V3.5C20.75 2.80964 20.1904 2.25 19.5 2.25ZM2.5 1C1.11929 1 0 2.11929 0 3.5V12.5C0 13.8807 1.11929 15 2.5 15H19.5C20.8807 15 22 13.8807 22 12.5V3.5C22 2.11929 20.8807 1 19.5 1H2.5ZM3 4.5H4H4.25H4.6899L4.98715 4.82428L7 7.02011L9.01285 4.82428L9.3101 4.5H9.75H10H11V5.5V11.5H9V7.79807L7.73715 9.17572L7 9.97989L6.26285 9.17572L5 7.79807V11.5H3V5.5V4.5ZM15 8V4.5H17V8H19.5L17 10.5L16 11.5L15 10.5L12.5 8H15Z"
          fill="currentColor"
        />
      </svg>
      View as Markdown
    </a>
  ),
  claude: (url: string) => (
    <a
      href={getPromptUrl('https://claude.ai/new', url)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          d="m4.714 15.956 4.718-2.648.079-.23-.08-.128h-.23l-.79-.048-2.695-.073-2.337-.097-2.265-.122-.57-.121-.535-.704.055-.353.48-.321.685.06 1.518.104 2.277.157 1.651.098 2.447.255h.389l.054-.158-.133-.097-.103-.098-2.356-1.596-2.55-1.688-1.336-.972-.722-.491L2 6.223l-.158-1.008.655-.722.88.06.225.061.893.686 1.906 1.476 2.49 1.833.364.304.146-.104.018-.072-.164-.274-1.354-2.446-1.445-2.49-.644-1.032-.17-.619a2.972 2.972 0 0 1-.103-.729L6.287.133 6.7 0l.995.134.42.364.619 1.415L9.735 4.14l1.555 3.03.455.898.243.832.09.255h.159V9.01l.127-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.583.28.48.685-.067.444-.286 1.851-.558 2.903-.365 1.942h.213l.243-.242.983-1.306 1.652-2.064.728-.82.85-.904.547-.431h1.032l.759 1.129-.34 1.166-1.063 1.347-.88 1.142-1.263 1.7-.79 1.36.074.11.188-.02 2.853-.606 1.542-.28 1.84-.315.832.388.09.395-.327.807-1.967.486-2.307.462-3.436.813-.043.03.049.061 1.548.146.662.036h1.62l3.018.225.79.522.473.638-.08.485-1.213.62-1.64-.389-3.825-.91-1.31-.329h-.183v.11l1.093 1.068 2.003 1.81 2.508 2.33.127.578-.321.455-.34-.049-2.204-1.657-.85-.747-1.925-1.62h-.127v.17l.443.649 2.343 3.521.122 1.08-.17.353-.607.213-.668-.122-1.372-1.924-1.415-2.168-1.141-1.943-.14.08-.674 7.254-.316.37-.728.28-.607-.461-.322-.747.322-1.476.388-1.924.316-1.53.285-1.9.17-.632-.012-.042-.14.018-1.432 1.967-2.18 2.945-1.724 1.845-.413.164-.716-.37.066-.662.401-.589 2.386-3.036 1.439-1.882.929-1.086-.006-.158h-.055L4.138 18.56l-1.13.146-.485-.456.06-.746.231-.243 1.907-1.312Z"
          fill="currentColor"
        />
      </svg>
      Open in Claude
    </a>
  ),
};

export function DocsCopyPage({ page, url }: { page: string; url: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const trigger = (
    <Button
      variant="secondary"
      size="sm"
      className="peer -ml-0.5 size-8 shadow-none md:size-7 md:text-[0.8rem]"
    >
      <IconChevronDown className="rotate-180 sm:rotate-0" />
    </Button>
  );

  return (
    <Popover>
      <div className="bg-secondary group/buttons relative flex rounded-lg *:[[data-slot=button]]:focus-visible:relative *:[[data-slot=button]]:focus-visible:z-10">
        <PopoverAnchor />
        <Button
          variant="secondary"
          size="sm"
          className="h-8 shadow-none md:h-7 md:text-[0.8rem]"
          onClick={() => copyToClipboard(page)}
        >
          {isCopied ? <IconCheck /> : <IconCopy />}
          Copy Page
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hidden sm:flex">
            {trigger}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="shadow-none">
            {Object.entries(menuItems).map(([key, value]) => (
              <DropdownMenuItem key={key} asChild>
                {value(url)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator
          orientation="vertical"
          className="!bg-foreground/10 absolute top-0 right-8 z-0 !h-8 peer-focus-visible:opacity-0 sm:right-7 sm:!h-7"
        />
        <PopoverTrigger asChild className="flex sm:hidden">
          {trigger}
        </PopoverTrigger>
        <PopoverContent
          className="bg-background/70 dark:bg-background/60 w-52 !origin-center rounded-lg p-1 shadow-sm backdrop-blur-sm"
          align="start"
        >
          {Object.entries(menuItems).map(([key, value]) => (
            <Button
              variant="ghost"
              size="lg"
              asChild
              key={key}
              className="*:[svg]:text-muted-foreground w-full justify-start text-base font-normal"
            >
              {value(url)}
            </Button>
          ))}
        </PopoverContent>
      </div>
    </Popover>
  );
}
