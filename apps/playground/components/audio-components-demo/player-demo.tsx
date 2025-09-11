import {
  PlayerButton,
  PlayerDuration,
  PlayerProgress,
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
  return (
    <div className="flex gap-2">
      <ul className="w-80 flex flex-col gap-2">
        {songs.map(song => (
          <SongListItem key={song.id} song={song} />
        ))}
      </ul>
      <Player />
    </div>
  );
};

const Player = () => {
  const player = usePlayer();

  console.log('here');

  return (
    <div className="bg-foreground/5 p-2 rounded-xl flex-1 flex gap-2">
      <PlayerButton
        variant="ghost"
        className="h-full w-16 hover:!bg-foreground/5"
      />
      <div className="flex flex-col justify-center w-full gap-1.5 pr-4">
        <p>{player.activeItem ? player.activeItem?.data.name : '-------'}</p>
        <div className="flex items-center gap-4">
          <PlayerTime />
          <PlayerProgress className="flex-1" />
          <PlayerDuration />
        </div>
      </div>
    </div>
  );
};

type Song = {
  id: string;
  name: string;
  url: string;
};

const songs = [
  {
    id: '1',
    name: 'Rise up rap',
    url: '/audio/rap.mp3',
  },
  {
    id: '2',
    name: 'Midnight swing',
    url: '/audio/jazz.mp3',
  },
];

const SongListItem = ({ song }: { song: Song }) => {
  const player = usePlayer();

  return (
    <li
      onClick={() => {
        if (player.isPlaying && player.isItemActive(song.id)) {
          player.pause();
        } else {
          player.play({
            id: song.id,
            src: song.url,
            data: song,
          });
        }
      }}
      className={cn(
        'group flex items-center justify-between rounded-xl p-2 hover:bg-foreground/5 cursor-pointer',
        player.isItemActive(song.id) && 'bg-foreground/5',
      )}
      tabIndex={0}
    >
      <p className="pl-3">{song.name}</p>
      <div
        className={cn(
          'opacity-0 group-hover:opacity-100',
          player.isItemActive(song.id) && 'opacity-100',
        )}
      >
        <PlayerButton
          variant="ghost"
          className="hover:!bg-foreground/5 w-9"
          item={{
            id: song.id,
            src: song.url,
            data: song,
          }}
          onClick={e => {
            e.stopPropagation();
          }}
        />
      </div>
    </li>
  );
};
