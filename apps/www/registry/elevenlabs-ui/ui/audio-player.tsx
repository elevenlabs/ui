"use client"

import {
  ComponentProps,
  createContext,
  HTMLProps,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { Check, PauseIcon, PlayIcon, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/elevenlabs-ui/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/elevenlabs-ui/ui/dropdown-menu"

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
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const formattedMins = mins < 10 ? `0${mins}` : mins
  const formattedSecs = secs < 10 ? `0${secs}` : secs

  return hrs > 0
    ? `${hrs}:${formattedMins}:${formattedSecs}`
    : `${mins}:${formattedSecs}`
}

/**
 * Represents an audio item in the audio player.
 * 
 * @template TData - Optional additional data associated with the audio item
 * 
 * @example
 * ```tsx
 * const audioItem: AudioPlayerItem = {
 *   id: "track-1",
 *   src: "https://example.com/audio.mp3",
 *   data: { title: "My Track", artist: "Artist Name" }
 * };
 * ```
 */
interface AudioPlayerItem<TData = unknown> {
  /**
   * Unique identifier for the audio item.
   * Can be a string or number.
   */
  id: string | number

  /**
   * URL or path to the audio file.
   * Supports various audio formats (MP3, WAV, OGG, etc.).
   */
  src: string

  /**
   * Optional additional data associated with this audio item.
   * Useful for storing metadata like title, artist, album, etc.
   */
  data?: TData
}

/**
 * Audio player API interface providing control over audio playback.
 * 
 * @template TData - Type of additional data associated with audio items
 * 
 * @example
 * ```tsx
 * const player = useAudioPlayer<{ title: string }>();
 * 
 * // Play an audio item
 * await player.play({ id: "track-1", src: "/audio.mp3", data: { title: "My Song" } });
 * 
 * // Check if playing
 * if (player.isPlaying) {
 *   console.log(`Playing: ${player.activeItem?.data?.title}`);
 * }
 * ```
 */
interface AudioPlayerApi<TData = unknown> {
  /**
   * Reference to the underlying HTMLAudioElement.
   * Useful for advanced audio manipulation or debugging.
   */
  ref: RefObject<HTMLAudioElement | null>

  /**
   * Currently active audio item being played or loaded.
   * null if no item is active.
   */
  activeItem: AudioPlayerItem<TData> | null

  /**
   * Duration of the current audio item in seconds.
   * undefined if no item is loaded or duration is unknown.
   */
  duration: number | undefined

  /**
   * Current playback error, if any.
   * null if no error has occurred.
   */
  error: MediaError | null

  /**
   * Whether audio is currently playing.
   * false if paused, stopped, or no item is loaded.
   */
  isPlaying: boolean

  /**
   * Whether audio is currently buffering.
   * true when loading or seeking through audio.
   */
  isBuffering: boolean

  /**
   * Current playback rate multiplier.
   * 1.0 is normal speed, 2.0 is double speed, 0.5 is half speed.
   */
  playbackRate: number

  /**
   * Check if a specific item is currently active.
   * @param id - The ID of the item to check
   * @returns true if the item is active, false otherwise
   * 
   * @example
   * ```tsx
   * const isActive = player.isItemActive("track-1");
   * ```
   */
  isItemActive: (id: string | number | null) => boolean

  /**
   * Set the active audio item without playing it.
   * @param item - The audio item to set as active, or null to clear
   * @returns Promise that resolves when the item is loaded
   * 
   * @example
   * ```tsx
   * await player.setActiveItem({ id: "track-1", src: "/audio.mp3" });
   * ```
   */
  setActiveItem: (item: AudioPlayerItem<TData> | null) => Promise<void>

  /**
   * Play audio, optionally setting a new active item.
   * @param item - Optional audio item to play. If not provided, plays/resumes current item
   * @returns Promise that resolves when playback starts
   * 
   * @example
   * ```tsx
   * // Play current item or resume if paused
   * await player.play();
   * 
   * // Play a specific item
   * await player.play({ id: "track-1", src: "/audio.mp3" });
   * ```
   */
  play: (item?: AudioPlayerItem<TData> | null) => Promise<void>

  /**
   * Pause the current audio playback.
   * 
   * @example
   * ```tsx
   * player.pause();
   * ```
   */
  pause: () => void

  /**
   * Seek to a specific time position in the current audio.
   * @param time - Time in seconds to seek to
   * 
   * @example
   * ```tsx
   * // Seek to 30 seconds
   * player.seek(30);
   * ```
   */
  seek: (time: number) => void

  /**
   * Set the playback rate for the current audio.
   * @param rate - Playback rate multiplier (1.0 = normal, 2.0 = double speed, 0.5 = half speed)
   * 
   * @example
   * ```tsx
   * // Set to double speed
   * player.setPlaybackRate(2.0);
   * ```
   */
  setPlaybackRate: (rate: number) => void
}

const AudioPlayerContext = createContext<AudioPlayerApi<unknown> | null>(null)

export function useAudioPlayer<TData = unknown>(): AudioPlayerApi<TData> {
  const api = useContext(AudioPlayerContext) as AudioPlayerApi<TData> | null
  if (!api) {
    throw new Error(
      "useAudioPlayer cannot be called outside of AudioPlayerProvider"
    )
  }
  return api
}

const AudioPlayerTimeContext = createContext<number | null>(null)

export const useAudioPlayerTime = () => {
  const time = useContext(AudioPlayerTimeContext)
  if (time === null) {
    throw new Error(
      "useAudioPlayerTime cannot be called outside of AudioPlayerProvider"
    )
  }
  return time
}

/**
 * Audio player context provider that manages audio playback state.
 * 
 * Wraps your application or component tree to provide audio player functionality
 * to child components via the useAudioPlayer hook.
 * 
 * @template TData - Type of additional data associated with audio items
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <AudioPlayerProvider>
 *       <AudioPlayerButton item={{ id: "track-1", src: "/audio.mp3" }} />
 *       <AudioPlayerProgress />
 *     </AudioPlayerProvider>
 *   );
 * }
 * ```
 */
export function AudioPlayerProvider<TData = unknown>({
  children,
}: {
  /**
   * Child components that will have access to the audio player context.
   */
  children: ReactNode
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const itemRef = useRef<AudioPlayerItem<TData> | null>(null)
  const playPromiseRef = useRef<Promise<void> | null>(null)
  const [readyState, setReadyState] = useState<number>(0)
  const [networkState, setNetworkState] = useState<number>(0)
  const [time, setTime] = useState<number>(0)
  const [duration, setDuration] = useState<number | undefined>(undefined)
  const [error, setError] = useState<MediaError | null>(null)
  const [activeItem, _setActiveItem] = useState<AudioPlayerItem<TData> | null>(
    null
  )
  const [paused, setPaused] = useState(true)
  const [playbackRate, setPlaybackRateState] = useState<number>(1)

  const setActiveItem = useCallback(
    async (item: AudioPlayerItem<TData> | null) => {
      if (!audioRef.current) return

      if (item?.id === itemRef.current?.id) {
        return
      }
      itemRef.current = item
      const currentRate = audioRef.current.playbackRate
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      if (item === null) {
        audioRef.current.removeAttribute("src")
      } else {
        audioRef.current.src = item.src
      }
      audioRef.current.load()
      audioRef.current.playbackRate = currentRate
    },
    []
  )

  const play = useCallback(
    async (item?: AudioPlayerItem<TData> | null) => {
      if (!audioRef.current) return

      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current
        } catch (error) {
          console.error("Play promise error:", error)
        }
      }

      if (item === undefined) {
        const playPromise = audioRef.current.play()
        playPromiseRef.current = playPromise
        return playPromise
      }
      if (item?.id === activeItem?.id) {
        const playPromise = audioRef.current.play()
        playPromiseRef.current = playPromise
        return playPromise
      }

      itemRef.current = item
      const currentRate = audioRef.current.playbackRate
      if (!audioRef.current.paused) {
        audioRef.current.pause()
      }
      audioRef.current.currentTime = 0
      if (item === null) {
        audioRef.current.removeAttribute("src")
      } else {
        audioRef.current.src = item.src
      }
      audioRef.current.load()
      audioRef.current.playbackRate = currentRate
      const playPromise = audioRef.current.play()
      playPromiseRef.current = playPromise
      return playPromise
    },
    [activeItem]
  )

  const pause = useCallback(async () => {
    if (!audioRef.current) return

    if (playPromiseRef.current) {
      try {
        await playPromiseRef.current
      } catch (e) {
        console.error(e)
      }
    }

    audioRef.current.pause()
    playPromiseRef.current = null
  }, [])

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = time
  }, [])

  const setPlaybackRate = useCallback((rate: number) => {
    if (!audioRef.current) return
    audioRef.current.playbackRate = rate
    setPlaybackRateState(rate)
  }, [])

  const isItemActive = useCallback(
    (id: string | number | null) => {
      return activeItem?.id === id
    },
    [activeItem]
  )

  useAnimationFrame(() => {
    if (audioRef.current) {
      _setActiveItem(itemRef.current)
      setReadyState(audioRef.current.readyState)
      setNetworkState(audioRef.current.networkState)
      setTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
      setPaused(audioRef.current.paused)
      setError(audioRef.current.error)
      setPlaybackRateState(audioRef.current.playbackRate)
    }
  })

  const isPlaying = !paused
  const isBuffering =
    readyState < ReadyState.HAVE_FUTURE_DATA &&
    networkState === NetworkState.NETWORK_LOADING

  const api = useMemo<AudioPlayerApi<TData>>(
    () => ({
      ref: audioRef,
      duration,
      error,
      isPlaying,
      isBuffering,
      activeItem,
      playbackRate,
      isItemActive,
      setActiveItem,
      play,
      pause,
      seek,
      setPlaybackRate,
    }),
    [
      audioRef,
      duration,
      error,
      isPlaying,
      isBuffering,
      activeItem,
      playbackRate,
      isItemActive,
      setActiveItem,
      play,
      pause,
      seek,
      setPlaybackRate,
    ]
  )

  return (
    <AudioPlayerContext.Provider value={api as AudioPlayerApi<unknown>}>
      <AudioPlayerTimeContext.Provider value={time}>
        <audio ref={audioRef} className="hidden" crossOrigin="anonymous" />
        {children}
      </AudioPlayerTimeContext.Provider>
    </AudioPlayerContext.Provider>
  )
}

export const AudioPlayerProgress = ({
  ...otherProps
}: Omit<
  ComponentProps<typeof SliderPrimitive.Root>,
  "min" | "max" | "value"
>) => {
  const player = useAudioPlayer()
  const time = useAudioPlayerTime()
  const wasPlayingRef = useRef(false)

  return (
    <SliderPrimitive.Root
      {...otherProps}
      value={[time]}
      onValueChange={(vals) => {
        player.seek(vals[0])
        otherProps.onValueChange?.(vals)
      }}
      min={0}
      max={player.duration ?? 0}
      step={otherProps.step || 0.25}
      onPointerDown={(e) => {
        wasPlayingRef.current = player.isPlaying
        player.pause()
        otherProps.onPointerDown?.(e)
      }}
      onPointerUp={(e) => {
        if (wasPlayingRef.current) {
          player.play()
        }
        otherProps.onPointerUp?.(e)
      }}
      className={cn(
        "group/player relative flex h-4 touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        otherProps.className
      )}
      onKeyDown={(e) => {
        if (e.key === " ") {
          e.preventDefault()
          if (!player.isPlaying) {
            player.play()
          } else {
            player.pause()
          }
        }
        otherProps.onKeyDown?.(e)
      }}
      disabled={
        player.duration === undefined ||
        !Number.isFinite(player.duration) ||
        Number.isNaN(player.duration)
      }
    >
      <SliderPrimitive.Track className="bg-muted relative h-[4px] w-full grow overflow-hidden rounded-full">
        <SliderPrimitive.Range className="bg-primary absolute h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="relative flex h-0 w-0 items-center justify-center opacity-0 group-hover/player:opacity-100 focus-visible:opacity-100 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        data-slot="slider-thumb"
      >
        <div className="bg-foreground absolute size-3 rounded-full" />
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  )
}

export const AudioPlayerTime = ({
  className,
  ...otherProps
}: HTMLProps<HTMLSpanElement>) => {
  const time = useAudioPlayerTime()
  return (
    <span
      {...otherProps}
      className={cn("text-muted-foreground text-sm tabular-nums", className)}
    >
      {formatTime(time)}
    </span>
  )
}

export const AudioPlayerDuration = ({
  className,
  ...otherProps
}: HTMLProps<HTMLSpanElement>) => {
  const player = useAudioPlayer()
  return (
    <span
      {...otherProps}
      className={cn("text-muted-foreground text-sm tabular-nums", className)}
    >
      {player.duration !== null &&
      player.duration !== undefined &&
      !Number.isNaN(player.duration)
        ? formatTime(player.duration)
        : "--:--"}
    </span>
  )
}

interface SpinnerProps {
  className?: string
}

function Spinner({ className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "border-muted border-t-foreground size-3.5 animate-spin rounded-full border-2",
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface PlayButtonProps extends React.ComponentProps<typeof Button> {
  playing: boolean
  onPlayingChange: (playing: boolean) => void
  loading?: boolean
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
      onClick={(e) => {
        onPlayingChange(!playing)
        onClick?.(e)
      }}
      className={cn("relative", className)}
      aria-label={playing ? "Pause" : "Play"}
      type="button"
    >
      {playing ? (
        <PauseIcon
          className={cn("size-4", loading && "opacity-0")}
          aria-hidden="true"
        />
      ) : (
        <PlayIcon
          className={cn("size-4", loading && "opacity-0")}
          aria-hidden="true"
        />
      )}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[inherit] backdrop-blur-xs">
          <Spinner />
        </div>
      )}
    </Button>
  )
}

export interface AudioPlayerButtonProps<TData = unknown>
  extends React.ComponentProps<typeof Button> {
  item?: AudioPlayerItem<TData>
}

export function AudioPlayerButton<TData = unknown>({
  item,
  ...otherProps
}: AudioPlayerButtonProps<TData>) {
  const player = useAudioPlayer<TData>()

  if (!item) {
    return (
      <PlayButton
        {...otherProps}
        playing={player.isPlaying}
        onPlayingChange={(shouldPlay) => {
          if (shouldPlay) {
            player.play()
          } else {
            player.pause()
          }
        }}
        loading={player.isBuffering && player.isPlaying}
      />
    )
  }

  return (
    <PlayButton
      {...otherProps}
      playing={player.isItemActive(item.id) && player.isPlaying}
      onPlayingChange={(shouldPlay) => {
        if (shouldPlay) {
          player.play(item)
        } else {
          player.pause()
        }
      }}
      loading={
        player.isItemActive(item.id) && player.isBuffering && player.isPlaying
      }
    />
  )
}

type Callback = (delta: number) => void

function useAnimationFrame(callback: Callback) {
  const requestRef = useRef<number | null>(null)
  const previousTimeRef = useRef<number | null>(null)
  const callbackRef = useRef<Callback>(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== null) {
        const delta = time - previousTimeRef.current
        callbackRef.current(delta)
      }
      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      previousTimeRef.current = null
    }
  }, [])
}

const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const

export interface AudioPlayerSpeedProps
  extends React.ComponentProps<typeof Button> {
  speeds?: readonly number[]
}

export function AudioPlayerSpeed({
  speeds = PLAYBACK_SPEEDS,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: AudioPlayerSpeedProps) {
  const player = useAudioPlayer()
  const currentSpeed = player.playbackRate

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(className)}
          aria-label="Playback speed"
          {...props}
        >
          <Settings className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {speeds.map((speed) => (
          <DropdownMenuItem
            key={speed}
            onClick={() => player.setPlaybackRate(speed)}
            className="flex items-center justify-between"
          >
            <span className={speed === 1 ? "" : "font-mono"}>
              {speed === 1 ? "Normal" : `${speed}x`}
            </span>
            {currentSpeed === speed && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export interface AudioPlayerSpeedButtonGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  speeds?: readonly number[]
}

export function AudioPlayerSpeedButtonGroup({
  speeds = [0.5, 1, 1.5, 2],
  className,
  ...props
}: AudioPlayerSpeedButtonGroupProps) {
  const player = useAudioPlayer()
  const currentSpeed = player.playbackRate

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="group"
      aria-label="Playback speed controls"
      {...props}
    >
      {speeds.map((speed) => (
        <Button
          key={speed}
          variant={currentSpeed === speed ? "default" : "outline"}
          size="sm"
          onClick={() => player.setPlaybackRate(speed)}
          className="min-w-[50px] font-mono text-xs"
        >
          {speed}x
        </Button>
      ))}
    </div>
  )
}

export const exampleTracks = [
  {
    id: "0",
    name: "II - 00",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/00.mp3",
  },
  {
    id: "1",
    name: "II - 01",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/01.mp3",
  },
  {
    id: "2",
    name: "II - 02",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/02.mp3",
  },
  {
    id: "3",
    name: "II - 03",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/03.mp3",
  },
  {
    id: "4",
    name: "II - 04",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/04.mp3",
  },
  {
    id: "5",
    name: "II - 05",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/05.mp3",
  },
  {
    id: "6",
    name: "II - 06",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/06.mp3",
  },
  {
    id: "7",
    name: "II - 07",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/07.mp3",
  },
  {
    id: "8",
    name: "II - 08",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/08.mp3",
  },
  {
    id: "9",
    name: "II - 09",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/09.mp3",
  },
]
