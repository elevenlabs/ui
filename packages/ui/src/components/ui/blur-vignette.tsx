'use client';

import React, { useState } from 'react';

import { Switch } from '@elevenlabs/ui/components/switch';

interface BlurVignetteProps {
  children: React.ReactNode;
  className?: string;
  radius?: string;
  inset?: string;
  transitionLength?: string;
  blur?: string;
  switchView?: boolean;
}

const BlurVignette = ({
  children,
  switchView,
  className = '',
  radius = '24px',
  inset = '16px',
  transitionLength = '32px',
  blur = '21px',
}: BlurVignetteProps) => {
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <style>
        {`
          .blur-vignette {
            --radius: ${radius};
            --inset: ${inset};
            --transition-length: ${transitionLength};
            --blur: ${blur};
            position: absolute;
            inset: 0;
            -webkit-backdrop-filter: blur(var(--blur));
            backdrop-filter: blur(var(--blur));
            --r: max(var(--transition-length), calc(var(--radius) - var(--inset)));
            --corner-size: calc(var(--r) + var(--inset)) calc(var(--r) + var(--inset));
            --corner-gradient: transparent 0px,
              transparent calc(var(--r) - var(--transition-length)), 
              black var(--r);
            --fill-gradient: black, 
              black var(--inset),
              transparent calc(var(--inset) + var(--transition-length)),
              transparent calc(100% - var(--transition-length) - var(--inset)),
              black calc(100% - var(--inset));
            --fill-narrow-size: calc(100% - (var(--inset) + var(--r)) * 2);
            --fill-farther-position: calc(var(--inset) + var(--r));
            -webkit-mask-image: linear-gradient(to right, var(--fill-gradient)),
              linear-gradient(to bottom, var(--fill-gradient)),
              radial-gradient(at bottom right, var(--corner-gradient)),
              radial-gradient(at bottom left, var(--corner-gradient)),
              radial-gradient(at top left, var(--corner-gradient)),
              radial-gradient(at top right, var(--corner-gradient));
            -webkit-mask-size: 100% var(--fill-narrow-size), 
              var(--fill-narrow-size) 100%,
              var(--corner-size), 
              var(--corner-size), 
              var(--corner-size),
              var(--corner-size);
            -webkit-mask-position: 0 var(--fill-farther-position), 
              var(--fill-farther-position) 0,
              0 0, 
              100% 0, 
              100% 100%, 
              0 100%;
            -webkit-mask-repeat: no-repeat;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .blur-vignette.active {
            opacity: 1;
          }
        `}
      </style>
      <div className={`blur-vignette ${isEnabled ? 'active' : ''}`} />
      {children}
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <span className="text-sm text-gray-600"></span>
        {switchView && (
          <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
        )}
      </div>
    </div>
  );
};

export default BlurVignette;
