import { MusicPlayer } from '@/registry/audio-components/blocks/music-player/components/music-player';

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <MusicPlayer />
      </div>
    </div>
  );
}
