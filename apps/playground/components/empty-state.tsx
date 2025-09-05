'use client';

import { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon | React.ComponentType<React.HTMLAttributes<SVGElement>>;
  message: string;
  className?: string;
  iconClassName?: string;
  messageClassName?: string;
}

export function EmptyState({
  icon: Icon,
  message,
  className,
  iconClassName,
  messageClassName,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex h-full flex-col items-center justify-center px-4',
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-lg bg-muted',
            iconClassName,
          )}
        >
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <p
          className={cn(
            'text-sm text-foreground font-medium',
            messageClassName,
          )}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
