'use client';

import { Button } from '@elevenlabs/ui/components/button';
import { Check, Terminal } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export const CopyCodeButton = () => {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <Button
      variant="outline"
      className="w-fit gap-1 px-3 shadow-none"
      size="sm"
      onClick={() => {
        copyToClipboard('npm i @elevenlabs/agents');
      }}
    >
      {isCopied ? <Check /> : <Terminal />}
      <span className="font-mono">npm i @elevenlabs/agents</span>
    </Button>
  );
};
