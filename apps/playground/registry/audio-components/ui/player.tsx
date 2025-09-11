import { cn } from '@/lib/utils';
import { Button } from '@elevenlabs/ui/components/button';
import { useAnimationFrame } from 'framer-motion';
import { PauseIcon, PlayIcon } from 'lucide-react';
import {
  ComponentProps,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

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
  isItemActive: (id: string | number | null) => boolean;
  play: (item?: PlayerItem | null) => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
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

  const seek = (time: number) => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = time;
  };

  const isItemActive = (id: string | number | null) => {
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
      isItemActive,
      play,
      pause,
      seek,
    }),
    [
      audioRef,
      activeItem,
      readyState,
      duration,
      error,
      isPlaying,
      isBuffering,
      isItemActive,
      play,
      pause,
      seek,
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

export interface PlayerProgressProps
  extends ComponentProps<typeof SliderPrimitive.Root> {}

export const PlayerProgress = ({ ...otherProps }: PlayerProgressProps) => {
  const player = usePlayer();
  const time = usePlayerTime();
  const wasPlayingRef = useRef(false);

  return (
    <SliderPrimitive.Root
      {...otherProps}
      value={[time]}
      onValueChange={([val]) => {
        player.seek(val);
      }}
      min={0}
      max={player.duration ?? 0}
      step={(player.duration ?? 0) < 60 ? 0.25 : 1}
      onPointerDown={e => {
        wasPlayingRef.current = player.isPlaying;
        player.pause();
        otherProps.onPointerDown?.(e);
      }}
      onPointerUp={e => {
        if (wasPlayingRef.current) {
          player.play();
        }
        otherProps.onPointerUp?.(e);
      }}
      className={cn(
        'relative group/player flex h-4 touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        otherProps.className,
      )}
      onKeyDown={e => {
        if (e.key === ' ') {
          e.preventDefault();
          if (!player.isPlaying) {
            player.play();
          } else {
            player.pause();
          }
        }
      }}
    >
      <SliderPrimitive.Track className="bg-foreground/10 relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-[3px] data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[3px]">
        <SliderPrimitive.Range className="bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="relative h-0 w-0 flex items-center justify-center opacity-0 group-hover/player:opacity-100 focus-visible:outline-none focus-visible:opacity-100 disabled:pointer-events-none disabled:opacity-50"
        data-slot="slider-thumb"
      >
        <div className="absolute h-2.5 w-2.5 rounded-full bg-foreground" />
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
};

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

interface PlayButtonProps extends React.ComponentProps<typeof Button> {
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
  loading?: boolean;
}

export const PlayButton = ({
  playing,
  onPlayingChange,
  className,
  onClick,
  loading,
  ...otherProps
}: PlayButtonProps) => {
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
        <PauseIcon className={cn('size-4', loading && 'opacity-0')} />
      ) : (
        <PlayIcon className={cn('size-4', loading && 'opacity-0')} />
      )}
      {loading && (
        <div className="absolute inset-0 rounded-[inherit] flex items-center justify-center backdrop-blur-xs">
          <Spinner size="sm" />
        </div>
      )}
    </Button>
  );
};

export interface PlayerButtonProps extends React.ComponentProps<typeof Button> {
  item?: PlayerItem;
}

export const PlayerButton = ({ item, ...otherProps }: PlayerButtonProps) => {
  const player = usePlayer();

  if (item) {
    return (
      <PlayButton
        {...otherProps}
        playing={player.isItemActive(item.id) && player.isPlaying}
        onPlayingChange={shouldPlay => {
          if (shouldPlay) {
            player.play(item);
          } else {
            player.pause();
          }
        }}
        loading={
          player.isItemActive(item.id) && player.isBuffering && player.isPlaying
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
