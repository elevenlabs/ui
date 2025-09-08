'use client';

import type * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface BlockProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  name: string;
  revealClass?: string;
  tag?: 'div' | 'section';
}

const Block = ({
  name,
  tag = 'div',
  revealClass = 'block-in-view',
  className,
  ...props
}: BlockProps) => {
  const Tag = tag;
  const intersectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 },
    );

    if (intersectionRef.current) {
      observer.observe(intersectionRef.current);
    }

    return () => {
      if (intersectionRef.current) {
        observer.unobserve(intersectionRef.current);
      }
    };
  }, []);

  return (
    <Tag
      className={cn(
        'block-el',
        `block-el-${name}`,
        inView ? revealClass : '',
        className,
      )}
      ref={intersectionRef}
      {...props}
    />
  );
};

Block.displayName = 'Block';

export { Block };
