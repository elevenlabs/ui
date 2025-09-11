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
  useRef,
  useState,
} from 'react';

enum ReadyState {
  HAVE_NOTHING = 0,
  HAVE_METADATA = 1,
  HAVE_CURRENT_DATA = 2,
  HAVE_FUTURE_DATA = 3,
  HAVE_ENOUGH_DATA = 4,
}

enum NetworkState {
  NETWORK_EMPTY = 0,
  NETWORK_IDLE = 1,
  NETWORK_LOADING = 2,
  NETWORK_NO_SOURCE = 3,
}

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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [readyState, setReadyState] = useState<number>(0);
  const [networkState, setNetworkState] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [error, setError] = useState<MediaError | null>(null);
  const [activeItem, setActiveItem] = useState<PlayerItem | null>(null);
  const [paused, setPaused] = useState(true);

  const setItem = async (item: PlayerItem | null) => {
    if (!audioRef.current) return;

    if (item?.id === activeItem?.id) {
      return;
    } else {
      if (item === null) {
        audioRef.current.removeAttribute('src');
      } else {
        audioRef.current.src = item.src;
      }
      await audioRef.current.load();
      setActiveItem(item);
      setTime(0);
      setDuration(undefined);
    }
  };

  const play = async (item?: PlayerItem | null) => {
    if (!audioRef.current) return;

    if (item === undefined) {
      return audioRef.current.play();
    } else if (item?.id === activeItem?.id) {
      return audioRef.current.play();
    } else {
      if (item === null) {
        audioRef.current.removeAttribute('src');
      } else {
        audioRef.current.src = item.src;
      }
      await audioRef.current.load();
      setActiveItem(item);
      setTime(0);
      setDuration(undefined);
      return audioRef.current.play();
    }
  };

  const pause = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
  };

  const isActive = (id: string | number | null) => {
    return activeItem?.id === id;
  };

  useAnimationFrame(() => {
    if (audioRef.current) {
      setReadyState(audioRef.current.readyState);
      setNetworkState(audioRef.current.networkState);
      setTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
      setPaused(audioRef.current.paused);
      setError(audioRef.current.error);
    }
  });

  const isPlaying = !paused;
  const isBuffering =
    readyState < ReadyState.HAVE_FUTURE_DATA &&
    networkState === NetworkState.NETWORK_LOADING;

  const api = useMemo(
    () => ({
      ref: audioRef,
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
      audioRef,
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
        <audio ref={audioRef} className="hidden" />
        {children}
      </PlayerTimeContext.Provider>
    </PlayerContext.Provider>
  );
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
        <PauseIcon className={cn('size-4.5', loading && 'opacity-0')} />
      ) : (
        <PlayIcon className={cn('size-4.5', loading && 'opacity-0')} />
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
