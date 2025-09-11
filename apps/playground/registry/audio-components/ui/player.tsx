'use client';

import { cn } from '@/lib/utils';
import { Button } from '@elevenlabs/ui/components/button';
import { useAnimationFrame } from 'framer-motion';
import { PauseIcon, PlayIcon } from 'lucide-react';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

function formatTime(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const formattedMins = mins < 10 ? `0${mins}` : mins;
  const formattedSecs = secs < 10 ? `0${secs}` : secs;

  return hrs > 0
    ? `${hrs}:${formattedMins}:${formattedSecs}`
    : `${mins}:${formattedSecs}`;
}

export interface PlayerProviderProps {}

interface PlayerState {
  src: string | null;
  time: number;
  readyState: number;
  error: any;
}

interface PlayerItem {
  id: string | number;
  src: string;
  data?: any;
}

interface PlayerApi {
  activeItem: PlayerItem | null;
  readyState: number;
  duration: number | undefined;
  error: MediaError | null;
  isPlaying: boolean;
  isBuffering: boolean;
  isActive: (id: string | number) => boolean;
  play: (item?: PlayerItem | null) => Promise<void>;
  pause: () => void;
}

const PlayerContext = createContext<PlayerApi | null>(null);

export const usePlayer = () => {
  const api = useContext(PlayerContext);
  if (!api) {
    throw new Error('usePlayer cannot be called outside of PlayerProvider');
  }
  return api;
};

const PlayerTimeContext = createContext<number | null>(null);

export const usePlayerTime = () => {
  const time = useContext(PlayerTimeContext);
  if (time === null) {
    throw new Error('usePlayerTime cannot be called outside of PlayerProvider');
  }
  return time;
};

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  //   const [state, setState] = useState<PlayerState>({
  //     src: null,
  //     time: 0,
  //     readyState: 0,
  //     error: null,
  //   });

  const [audio] = useState(() => new Audio());
  const [readyState, setReadyState] = useState<number>(0);
  const [networkState, setNetworkState] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [error, setError] = useState<MediaError | null>(null);
  const [activeItem, setActiveItem] = useState<PlayerItem | null>(null);
  const [paused, setPaused] = useState(true);

  const setItem = async (item: PlayerItem | null) => {
    if (item?.id === activeItem?.id) {
      return;
    } else {
      if (item === null) {
        audio.removeAttribute('src');
      } else {
        audio.src = item.src;
      }
      await audio.load();
      setActiveItem(item);
      setTime(0);
      setDuration(undefined);
    }
  };

  const play = async (item?: PlayerItem | null) => {
    if (item === undefined) {
      return audio.play();
    } else if (item?.id === activeItem?.id) {
      return audio.play();
    } else {
      if (item === null) {
        audio.removeAttribute('src');
      } else {
        audio.src = item.src;
      }
      await audio.load();
      setActiveItem(item);
      setTime(0);
      setDuration(undefined);
      return audio.play();
    }
  };

  const pause = () => {
    audio.pause();
  };

  const isActive = (id: string | number | null) => {
    return activeItem?.id === id;
  };

  useAnimationFrame(() => {
    setReadyState(audio.readyState);
    setNetworkState(audio.networkState);
    setTime(audio.currentTime);
    setDuration(audio.duration);
    setPaused(audio.paused);
    setError(audio.error);
  });

  //   useEffect(() => {
  //     if (!activeItem) {
  //       audio.removeAttribute('src');
  //       audio.load();
  //     } else {
  //       audio.src = activeItem.src;
  //       audio.load();
  //     }
  //   }, [activeItem]);

  const isPlaying = !paused;
  const isBuffering =
    readyState < HTMLMediaElement.HAVE_FUTURE_DATA &&
    networkState === HTMLMediaElement.NETWORK_LOADING;

  const api = useMemo(
    () => ({
      audio,
      activeItem,
      readyState,
      duration,
      error,
      isPlaying,
      isBuffering,
      isActive,
      play,
      pause,
    }),
    [
      audio,
      activeItem,
      readyState,
      duration,
      error,
      isPlaying,
      isBuffering,
      isActive,
      play,
      pause,
    ],
  );

  return (
    <PlayerContext.Provider value={api}>
      <PlayerTimeContext.Provider value={time}>
        {children}
      </PlayerTimeContext.Provider>
    </PlayerContext.Provider>
  );

  //   return (
  //     <audio
  //       ref={ref}
  //       onDurationChange={e => {
  //         setDuration(e.currentTarget.duration);
  //       }}
  //       onError={e => {
  //         setError(e.currentTarget.error);
  //       }}
  //     >
  //       {src && <source src={src} />}
  //     </audio>
  //   );
};

export interface PlayerProgressProps {}

export const PlayerProgress = () => {};

export interface PlayerTimeProps {}

export interface PlayerDurationProps {}

export const PlayerTime = () => {
  const time = usePlayerTime();

  return (
    <span className="tabular-nums text-sm text-foreground/50">
      {formatTime(time)}
    </span>
  );
};

export const PlayerDuration = () => {
  const player = usePlayer();
  return (
    <span className="tabular-nums text-sm text-foreground/50">
      {player.duration != null && !Number.isNaN(player.duration)
        ? formatTime(player.duration)
        : '--:--'}
    </span>
  );
};

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-foreground/20 border-t-foreground',
        sizeClasses[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export const PlayButton = ({
  playing,
  onPlayingChange,
  className,
  onClick,
  loading,
  ...otherProps
}: {
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
  loading?: boolean;
} & React.ComponentProps<typeof Button>) => {
  return (
    <Button
      {...otherProps}
      onClick={e => {
        onPlayingChange(!playing);
        onClick?.(e);
      }}
      className={cn('relative', className)}
      aria-label={playing ? 'Pause' : 'Play'}
    >
      {playing ? (
        <PauseIcon className={cn('', loading && 'opacity-20')} />
      ) : (
        <PlayIcon className={cn('w-8 h-8', loading && 'opacity-20')} />
      )}
      {loading && (
        <div className="absolute inset-0 rounded-[inherit] flex items-center justify-center backdrop-blur-xs">
          <Spinner size="sm" />
        </div>
      )}
    </Button>
  );
};

export interface PlayerButtonProps {}

export const PlayerButton = ({
  item,
  ...otherProps
}: {
  item?: PlayerItem;
} & React.ComponentProps<typeof Button>) => {
  const player = usePlayer();

  if (item) {
    return (
      <PlayButton
        {...otherProps}
        playing={player.isActive(item.id) && player.isPlaying}
        onPlayingChange={shouldPlay => {
          if (shouldPlay) {
            player.play(item);
          } else {
            player.pause();
          }
        }}
        loading={
          player.isActive(item.id) && player.isBuffering && player.isPlaying
        }
      />
    );
  } else {
    return (
      <PlayButton
        {...otherProps}
        playing={player.isPlaying}
        onPlayingChange={shouldPlay => {
          if (shouldPlay) {
            player.play();
          } else {
            player.pause();
          }
        }}
        loading={player.isBuffering && player.isPlaying}
      />
    );
  }
};
