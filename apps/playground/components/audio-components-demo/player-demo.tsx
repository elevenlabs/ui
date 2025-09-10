import {
  PlayerButton,
  PlayerProvider,
  PlayerTime,
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
    <div className="flex gap-2">
      <ul className="w-80 flex flex-col gap-2">
        {songs.map(song => (
          <SongListItem key={song.name} song={song} />
        ))}
      </ul>
      <div className="bg-foreground/5 p-2 rounded-xl flex-1 flex gap-2">
        <PlayerButton variant="ghost" className="h-full w-14" />
        <div className="flex flex-col justify-center gap-1">
          <p>Title</p>
          <PlayerTime />
        </div>
      </div>
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
    <li
      onClick={() => {
        if (player.isPlaying && player.isActive(song.name)) {
          player.pause();
        } else {
          player.play({
            item: {
              id: song.name,
              src: song.url,
            },
          });
        }
      }}
      className={cn(
        'group flex items-center justify-between rounded-xl p-0 hover:bg-foreground/5',
        player.activeItem?.id === song.name && 'bg-foreground/5',
      )}
      tabIndex={0}
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
          onClick={e => {
            e.stopPropagation();
          }}
        />
      </div>
    </li>
  );
};
