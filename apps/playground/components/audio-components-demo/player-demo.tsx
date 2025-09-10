import {
  PlayerButton,
  PlayerProvider,
  usePlayer,
} from '@/registry/audio-components/ui/player';
import { cn } from '@elevenlabs/ui/lib/utils';

export const PlayerDemoWrapper = () => {
  return (
    <PlayerProvider>
      <PlayerDemo />
    </PlayerProvider>
  );
};

const PlayerDemo = () => {
  const player = usePlayer();
  return (
    <div>
      <div>
        {songs.map(song => (
          <SongListItem key={song.name} song={song} />
        ))}
      </div>
      <PlayerButton />
    </div>
  );
};

type Song = {
  name: string;
  url: string;
  duration: number;
};

const songs = [
  {
    name: 'Four Five Seconds',
    url: '/audio/rap.mp3',
    duration: 120,
  },
  {
    name: 'Alone',
    url: '/audio/jazz.mp3',
    duration: 120,
  },
];

const SongListItem = ({ song }: { song: Song }) => {
  const player = usePlayer();

  return (
    <button
      onClick={() => {
        if (player.isPlaying) {
          player.play({
            id: song.name,
            src: song.url,
          });
        } else {
          player.pause();
        }
      }}
      className={cn(
        'group flex items-center justify-between rounded-2xl p-2 hover:bg-gray-200',
        player.activeItem?.id === song.name && 'bg-gray-100',
      )}
    >
      <p className="pl-3">{song.name}</p>
      <div
        className={cn(
          'opacity-0 group-hover:opacity-100',
          player.isActive(song.name) && 'opacity-100',
        )}
      >
        <PlayerButton
          variant="ghost"
          item={{
            id: song.name,
            src: song.url,
          }}
        />
      </div>
    </button>
  );
};
