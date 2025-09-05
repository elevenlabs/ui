'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useRive } from '@rive-app/react-canvas';
import { Block } from './block';

const GridItem = ({
  className,
  title,
  description,
}: {
  className?: string;
  description: string;
  title: string;
}) => {
  return (
    <div
      className={cn(
        'col-span-1 row-span-1 flex flex-col items-start justify-start px-5 py-5 md:px-12 md:py-10 xl:px-[60px] xl:py-12',
        'border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]',
        className,
      )}
    >
      <div className="text-[13px] md:text-sm font-normal mb-2 text-foreground/90">
        {title}
      </div>
      <div className="text-[13px] md:text-sm text-foreground/60 leading-relaxed">
        {description}
      </div>
    </div>
  );
};

const CornerMarker = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      fill="none"
      height="31"
      viewBox="0 0 31 31"
      width="31"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30.5 0.5H0.5V30.5"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1"
      />
    </svg>
  );
};

const CornerMarkers = () => {
  return (
    <>
      <CornerMarker className="absolute left-[-1px] top-[-1px]" />
      <CornerMarker className="absolute right-[-1px] top-[-1px] rotate-90" />
      <CornerMarker className="absolute bottom-[-1px] right-[-1px] rotate-180" />
      <CornerMarker className="absolute bottom-[-1px] left-[-1px] -rotate-90" />
    </>
  );
};

const DeveloperToolkitWidget = dynamic(
  () => import('./developer-toolkit-widget'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-center px-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6 animate-pulse">
            <svg
              className="w-12 h-12 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h4 className="text-xl font-semibold mb-2">Loading...</h4>
        </div>
      </div>
    ),
  },
);

export const BlockDeveloperToolkit = () => {
  const gridItems = [
    {
      title: 'Powerful SDK',
      description:
        'Write your own conversational agent with our SDK in Python or JavaScript',
    },
    {
      title: 'Low latency',
      description: 'The most responsive conversational AI, with <500ms latency',
    },
    {
      title: 'Bring any LLM',
      description: 'Choose from any LLM, including your own custom LLM',
    },
    {
      title: 'RAG out of the box',
      description:
        'Simple support for external knowledge bases and custom tools',
    },
  ];

  return (
    <Block name="developer-toolkit">
      <div className="relative mx-auto flex max-w-[700px] flex-col items-center justify-center lg:max-w-full">
        {/* Title */}
        <div className="flex w-full items-center justify-center border-x border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] px-4 pb-[100px] pt-[100px] md:pb-[120px] md:pt-[120px] text-center">
          <h3 className="text-[36px] md:text-[48px] leading-[1.1] font-normal tracking-[-0.02em] max-w-2xl">
            Ship production-grade agents
          </h3>
        </div>
        {/* Main grid */}
        <div
          className="relative flex w-full grid-rows-2 flex-col gap-0 border-x border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] [--center-width:480px] sm:[--center-width:320px] md:[--center-width:380px] lg:grid xl:[--center-width:480px]"
          style={{ gridTemplateColumns: '1fr var(--center-width) 1fr' }}
        >
          {/* Top left card */}
          <GridItem
            className="col-start-1 row-start-1 border-b border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]"
            description={gridItems[0].description}
            title={gridItems[0].title}
          />

          {/* Top right card */}
          <GridItem
            className="col-start-3 row-start-1 border-b border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]"
            description={gridItems[1].description}
            title={gridItems[1].title}
          />

          {/* Center content, spans 2 rows */}
          <div
            className="relative col-start-2 row-span-2 row-start-1 flex min-h-full w-full items-center justify-center border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-muted/30"
            style={{ aspectRatio: '16/17' }}
          >
            <CornerMarkers />
            <div
              className="absolute left-0 top-0 h-full w-full overflow-hidden [--bg-size:6.27%]"
              style={{
                backgroundImage:
                  "url('/assets/images/convai/line-grid-block.svg')",
                backgroundRepeat: 'repeat',
                backgroundSize: 'var(--bg-size) auto',
              }}
            />
            <div className="relative z-[5] flex h-full w-full items-center justify-center">
              <DeveloperToolkitWidget />
            </div>
          </div>

          {/* Bottom left card */}
          <GridItem
            className="col-start-1 row-start-2 border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]"
            description={gridItems[2].description}
            title={gridItems[2].title}
          />

          {/* Bottom right card */}
          <GridItem
            className="col-start-3 row-start-2 border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]"
            description={gridItems[3].description}
            title={gridItems[3].title}
          />
        </div>
      </div>
    </Block>
  );
};
