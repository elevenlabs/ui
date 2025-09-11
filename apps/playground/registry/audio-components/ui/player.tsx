import { cn } from '@/lib/utils';
import { Button } from '@elevenlabs/ui/components/button';
import { useAnimationFrame } from 'framer-motion';
import { PauseIcon, PlayIcon } from 'lucide-react';
import {
  ComponentProps,
  createContext,
  HTMLProps,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
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
  ref: RefObject<HTMLAudioElement | null>;
  activeItem: PlayerItem | null;
  duration: number | undefined;
  error: MediaError | null;
  isPlaying: boolean;
  isBuffering: boolean;
  isItemActive: (id: string | number | null) => boolean;
  setActiveItem: (item: PlayerItem | null) => Promise<void>;
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
  const itemRef = useRef<PlayerItem | null>(null);
  const [readyState, setReadyState] = useState<number>(0);
  const [networkState, setNetworkState] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [error, setError] = useState<MediaError | null>(null);
  const [activeItem, _setActiveItem] = useState<PlayerItem | null>(null);
  const [paused, setPaused] = useState(true);

  const setActiveItem = useCallback(async (item: PlayerItem | null) => {
    if (!audioRef.current) return;

    if (item?.id === itemRef.current?.id) {
      return;
    } else {
      itemRef.current = item;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (item === null) {
        audioRef.current.removeAttribute('src');
      } else {
        audioRef.current.src = item.src;
      }
      await audioRef.current.load();
    }
  }, []);

  const play = useCallback(
    async (item?: PlayerItem | null) => {
      if (!audioRef.current) return;

      if (item === undefined) {
        return audioRef.current.play();
      } else if (item?.id === activeItem?.id) {
        return audioRef.current.play();
      } else {
        itemRef.current = item;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        if (item === null) {
          audioRef.current.removeAttribute('src');
        } else {
          audioRef.current.src = item.src;
        }
        await audioRef.current.load();
        return audioRef.current.play();
      }
    },
    [activeItem],
  );

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  }, []);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
  }, []);

  const isItemActive = useCallback(
    (id: string | number | null) => {
      return activeItem?.id === id;
    },
    [activeItem],
  );

  useAnimationFrame(() => {
    if (audioRef.current) {
      _setActiveItem(itemRef.current);
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
      duration,
      error,
      isPlaying,
      isBuffering,
      activeItem,
      isItemActive,
      setActiveItem,
      play,
      pause,
      seek,
    }),
    [
      audioRef,
      duration,
      error,
      isPlaying,
      isBuffering,
      activeItem,
      isItemActive,
      setActiveItem,
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
  extends Omit<
    ComponentProps<typeof SliderPrimitive.Root>,
    'min' | 'max' | 'value'
  > {}

export const PlayerProgress = ({ ...otherProps }: PlayerProgressProps) => {
  const player = usePlayer();
  const time = usePlayerTime();
  const wasPlayingRef = useRef(false);

  return (
    <SliderPrimitive.Root
      {...otherProps}
      value={[time]}
      onValueChange={vals => {
        player.seek(vals[0]);
        otherProps.onValueChange?.(vals);
      }}
      min={0}
      max={player.duration ?? 0}
      step={otherProps.step || (player.duration ?? 0) < 60 ? 0.25 : 1}
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
        otherProps.onKeyDown?.(e);
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

interface PlayerTimeProps extends HTMLProps<HTMLSpanElement> {}

export const PlayerTime = ({ className, ...otherProps }: PlayerTimeProps) => {
  const time = usePlayerTime();
  return (
    <span
      {...otherProps}
      className={cn('tabular-nums text-sm text-foreground/50', className)}
    >
      {formatTime(time)}
    </span>
  );
};

interface PlayerDurationProps extends HTMLProps<HTMLSpanElement> {}

export const PlayerDuration = ({
  className,
  ...otherProps
}: PlayerDurationProps) => {
  const player = usePlayer();
  return (
    <span
      {...otherProps}
      className={cn('tabular-nums text-sm text-foreground/50', className)}
    >
      {player.duration != null && !Number.isNaN(player.duration)
        ? formatTime(player.duration)
        : '--:--'}
    </span>
  );
};

interface SpinnerProps {
  className?: string;
}

function Spinner({ className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-foreground/20 border-t-foreground size-3.5',
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

const PlayButton = ({
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
          <Spinner />
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
