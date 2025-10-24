---
title: Matrix
description: A retro dot-matrix display component with circular cells and smooth animations. Perfect for retro displays, indicators, and audio visualizations.
featured: true
component: true
---

<ComponentPreview
  name="matrix-demo"
  description="An interactive matrix display with smooth animations and unified patterns."
  hideCode={true}
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx @elevenlabs/cli@latest components add matrix
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="matrix" title="components/ui/matrix.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { digits, loader, Matrix, vu, wave } from "@/components/ui/matrix"
```

### Static Pattern

```tsx showLineNumbers
<Matrix rows={7} cols={5} pattern={digits[5]} ariaLabel="Number five" />
```

### Animated Display

```tsx showLineNumbers
<Matrix
  rows={7}
  cols={7}
  frames={wave}
  fps={20}
  loop
  ariaLabel="Wave animation"
/>
```

### VU Meter

```tsx showLineNumbers
<Matrix
  rows={7}
  cols={12}
  mode="vu"
  levels={[0.1, 0.6, 0.9, 0.7, 0.4, 0.8, 0.5, 0.3, 0.6, 0.9, 0.5, 0.2]}
/>
```

## API Reference

### Matrix

The main matrix display component.

```tsx
<Matrix rows={7} cols={7} frames={wave} fps={20} />
```

#### Props

| Prop       | Type                                   | Description                                                    |
| ---------- | -------------------------------------- | -------------------------------------------------------------- |
| rows       | `number`                               | Number of rows in the matrix (required)                        |
| cols       | `number`                               | Number of columns in the matrix (required)                     |
| pattern    | `Frame`                                | Static pattern to display (2D array of brightness values 0-1)  |
| frames     | `Frame[]`                              | Array of frames for animation (ignored if pattern is provided) |
| fps        | `number`                               | Frames per second for animation. Default: 12                   |
| autoplay   | `boolean`                              | Start animation automatically. Default: true                   |
| loop       | `boolean`                              | Loop animation. Default: true                                  |
| size       | `number`                               | Cell size in pixels. Default: 10                               |
| gap        | `number`                               | Gap between cells in pixels. Default: 2                        |
| palette    | `{on: string, off: string}`            | CSS colors for on/off states. Defaults to theme colors         |
| brightness | `number`                               | Global brightness multiplier (0-1). Default: 1                 |
| ariaLabel  | `string`                               | ARIA label for accessibility                                   |
| onFrame    | `(index: number) => void`              | Callback when frame changes during animation                   |
| mode       | `"default" \| "vu"`                    | Display mode. Default: "default"                               |
| levels     | `number[]`                             | Live levels for VU meter mode (0-1 per column)                 |
| className  | `string`                               | Additional CSS classes                                         |
| ...props   | `React.HTMLAttributes<HTMLDivElement>` | All standard div element props                                 |

### Frame Type

```tsx
type Frame = number[][] // [row][col] brightness 0..1
```

A frame is a 2D array where each value represents the brightness of a cell (0 = off, 1 = full brightness).

Example:

```tsx
const smiley: Frame = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 1, 0, 1, 1],
  [1, 0, 0, 0, 1],
  [0, 1, 1, 1, 0],
]
```

## Presets

The component comes with several built-in presets and animations:

### digits

7-segment style digits (0-9) on a 7×5 grid.

```tsx
import { digits, Matrix } from "@/components/ui/matrix"

export default () => <Matrix rows={7} cols={5} pattern={digits[5]} />
```

### loader

Rotating spinner animation (7×7, 12 frames).

```tsx
import { loader, Matrix } from "@/components/ui/matrix"

export default () => <Matrix rows={7} cols={7} frames={loader} fps={12} />
```

### pulse

Expanding pulse effect (7×7, 16 frames).

```tsx
import { Matrix, pulse } from "@/components/ui/matrix"

export default () => <Matrix rows={7} cols={7} frames={pulse} fps={16} />
```

### wave

Smooth sine wave animation (7×7, 24 frames).

```tsx
import { Matrix, wave } from "@/components/ui/matrix"

export default () => <Matrix rows={7} cols={7} frames={wave} fps={20} />
```

### snake

Snake traversal pattern (7×7, ~40 frames).

```tsx
import { Matrix, snake } from "@/components/ui/matrix"

export default () => <Matrix rows={7} cols={7} frames={snake} fps={15} />
```

### chevronLeft / chevronRight

Simple directional arrows (5×5).

```tsx
import { chevronLeft, Matrix } from "@/components/ui/matrix"

export default () => <Matrix rows={5} cols={5} pattern={chevronLeft} />
```

### vu()

Helper function to create VU meter frames.

```tsx
import { Matrix, vu } from "@/components/ui/matrix"

export default () => {
  const levels = [0.3, 0.6, 0.9, 0.7, 0.5]
  return <Matrix rows={7} cols={5} pattern={vu(5, levels)} />
}
```

## Examples

### Retro Display

```tsx showLineNumbers
function RetroDisplay() {
  return (
    <div className="bg-muted/30 rounded-lg border p-8">
      <Matrix
        rows={7}
        cols={7}
        frames={wave}
        fps={20}
        size={16}
        gap={3}
        palette={{
          on: "hsl(142 76% 36%)",
          off: "hsl(142 76% 10%)",
        }}
        ariaLabel="Wave animation"
      />
    </div>
  )
}
```

### Digital Clock Digit

```tsx showLineNumbers
function ClockDigit({ value }: { value: number }) {
  return (
    <Matrix
      rows={7}
      cols={5}
      pattern={digits[value]}
      size={12}
      gap={2}
      ariaLabel={`Digit ${value}`}
    />
  )
}
```

### Audio Level Meter

```tsx showLineNumbers
function AudioMeter({ frequencyData }: { frequencyData: number[] }) {
  // Convert frequency data to 0-1 levels
  const levels = frequencyData.map((freq) => freq / 255)

  return (
    <Matrix
      rows={7}
      cols={frequencyData.length}
      mode="vu"
      levels={levels}
      size={8}
      gap={1}
      ariaLabel="Audio frequency meter"
    />
  )
}
```

### Custom Pattern

```tsx showLineNumbers
function Heart() {
  const heartPattern: Frame = [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ]

  return (
    <Matrix
      rows={6}
      cols={7}
      pattern={heartPattern}
      size={14}
      gap={2}
      palette={{
        on: "hsl(0 84% 60%)",
        off: "hsl(0 84% 20%)",
      }}
    />
  )
}
```

## Advanced Usage

### Creating Custom Animations

```tsx showLineNumbers
function CustomAnimation() {
  // Create a simple blink animation
  const frames: Frame[] = [
    [
      [1, 0, 1],
      [0, 1, 0],
      [1, 0, 1],
    ], // Frame 1
    [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ], // Frame 2
  ]

  return <Matrix rows={3} cols={3} frames={frames} fps={2} loop />
}
```

### Frame Change Callback

```tsx showLineNumbers
function AnimationTracker() {
  const [currentFrame, setCurrentFrame] = useState(0)

  return (
    <div>
      <Matrix
        rows={7}
        cols={7}
        frames={loader}
        fps={12}
        onFrame={setCurrentFrame}
      />
      <p>Frame: {currentFrame}</p>
    </div>
  )
}
```

### Dynamic VU Meter

```tsx showLineNumbers
function LiveVUMeter() {
  const [levels, setLevels] = useState(Array(12).fill(0))

  useEffect(() => {
    // Simulate audio levels
    const interval = setInterval(() => {
      setLevels(Array.from({ length: 12 }, () => Math.random()))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <Matrix rows={7} cols={12} mode="vu" levels={levels} size={10} gap={2} />
  )
}
```

## Theming

The component uses CSS variables for theming:

```tsx
<Matrix
  palette={{
    on: "currentColor", // Active cells (default - inherits text color)
    off: "var(--muted-foreground)", // Inactive cells (default - muted but visible)
  }}
/>
```

### Classic Phosphor Green

```tsx
palette={{
  on: "hsl(142 76% 36%)",
  off: "hsl(142 76% 10%)",
}}
```

### Amber Terminal

```tsx
palette={{
  on: "hsl(38 92% 50%)",
  off: "hsl(38 92% 15%)",
}}
```

### Blue Neon

```tsx
palette={{
  on: "hsl(200 98% 39%)",
  off: "hsl(200 98% 12%)",
}}
```

## Performance

- Uses SVG for crisp rendering at any size
- Cell positions are precomputed and memoized
- Only opacity updates during frame transitions
- Stable FPS with time accumulator and `requestAnimationFrame`
- Tested with 7×7 (49 cells) and 16×16 (256 cells) grids
- Proper cleanup of animation frames on unmount

## Accessibility

- Container has `role="img"` for semantic meaning
- Configurable `aria-label` for description
- Animated displays use `aria-live="polite"`
- Frame information available via `onFrame` callback
- All interactive demos support keyboard navigation

## Notes

- Frames use brightness values from 0 (off) to 1 (full on)
- Circular cells provide a classic dot-matrix appearance
- VU meter mode provides real-time column-based visualization
- All presets are optimized for 7×7 or similar small grids
- Works in SSR environments (animation starts on mount)
- Compatible with all modern browsers
- Supports both light and dark themes
