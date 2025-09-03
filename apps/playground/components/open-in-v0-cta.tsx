import { cn } from "@/lib/utils";
import { Button } from "@elevenlabs/ui/components/button";

export function OpenInV0Cta({ className }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group bg-surface text-surface-foreground relative flex flex-col gap-2 rounded-lg p-6 text-sm",
        className
      )}
    >
      <div className="text-base leading-tight font-semibold text-balance group-hover:underline">
        Build with ElevenLabs
      </div>
      <div className="text-muted-foreground">
        ElevenLabs provides tools to build voice and audio experiences at scale.
      </div>
      <Button size="sm" className="mt-2 w-fit">
        Get Started
      </Button>
      <a
        href="https://elevenlabs.io?utm_source=growth_experiment&utm_medium=web&utm_campaign=showcase_cta"
        target="_blank"
        rel="noreferrer"
        className="absolute inset-0"
      >
        <span className="sr-only">Deploy to Vercel</span>
      </a>
    </div>
  );
}
