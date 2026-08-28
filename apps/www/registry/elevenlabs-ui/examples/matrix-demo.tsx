"use client"

import { useEffect, useState } from "react"

import {
  Matrix,
  pulse,
  snake,
  wave,
  type Frame,
} from "@/registry/elevenlabs-ui/ui/matrix"

type Mode = "individual" | "focus" | "expand" | "unified" | "collapse" | "burst"

const transitions: Record<Mode, { next: Mode; delay: number }> = {
  individual: { next: "focus", delay: 4000 },
  focus: { next: "expand", delay: 2000 },
  expand: { next: "unified", delay: 2500 },
  unified: { next: "collapse", delay: 4000 },
  collapse: { next: "burst", delay: 2500 },
  burst: { next: "individual", delay: 800 },
}

const Example = () => {
  const [mode, setMode] = useState<Mode>("individual")
  const [unifiedFrame, setUnifiedFrame] = useState(0)
  const [expandProgress, setExpandProgress] = useState(0)
  const [collapseProgress, setCollapseProgress] = useState(0)

  useEffect(() => {
    const { next, delay } = transitions[mode]
    const timeout = setTimeout(() => setMode(next), delay)
    return () => clearTimeout(timeout)
  }, [mode])

  useEffect(() => {
    if (mode !== "unified") return

    let frame = 0
    const animate = setInterval(() => {
      frame += 1
      setUnifiedFrame(frame)
    }, 50)

    return () => clearInterval(animate)
  }, [mode])

  useEffect(() => {
    if (mode !== "expand") {
      setExpandProgress(0)
      return
    }

    let start = 0
    const duration = 2500
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (start === 0) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)

      setExpandProgress(progress)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [mode])

  useEffect(() => {
    if (mode !== "collapse") {
      setCollapseProgress(0)
      return
    }

    let start = 0
    const duration = 2500
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (start === 0) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)

      setCollapseProgress(progress)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [mode])

  const configurations = [
    { animation: pulse, fps: 16 },
    { animation: wave, fps: 20 },
    { animation: spinner, fps: 10 },
    { animation: snake, fps: 15 },
    { animation: elevenLogo, fps: 12 },
    { animation: sandTimer, fps: 12 },
    { animation: corners, fps: 10 },
    { animation: sweep, fps: 14 },
    { animation: expand, fps: 12 },
  ]

  const unifiedPatterns =
    mode === "unified" ? createUnifiedPattern(unifiedFrame) : []

  const expandedPatterns =
    mode === "expand" ? createExpandedLogo(expandProgress) : []
  const collapsePatterns =
    mode === "collapse" ? createCollapseEffect(collapseProgress) : []

  const getPatternForMatrix = (index: number) => {
    if (mode === "individual") {
      return undefined
    } else if (mode === "focus") {
      if (index === 4) {
        const frame: Frame = Array(7)
          .fill(0)
          .map(() => Array(7).fill(0))
        for (let r = 1; r <= 5; r++) {
          frame[r][2] = 1
          frame[r][4] = 1
        }
        return frame
      }
      return Array(7)
        .fill(0)
        .map(() => Array(7).fill(0))
    } else if (mode === "expand") {
      return expandedPatterns[index]
    } else if (mode === "unified") {
      return unifiedPatterns[index]
    } else if (mode === "collapse") {
      return collapsePatterns[index]
    } else if (mode === "burst") {
      return undefined
    }
  }

  const getFramesForMatrix = (index: number) => {
    if (mode === "individual") {
      return configurations[index].animation
    } else if (mode === "burst") {
      return burst
    }
    return undefined
  }

  const getFps = (index: number) => {
    if (mode === "burst") return 30
    return configurations[index].fps
  }

  return (
    <div className="flex min-h-[600px] w-full flex-col items-center justify-center p-8">
      <div
        className="grid gap-1.5 transition-all duration-1000"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
        }}
      >
        {configurations.map((config, index) => (
          <div
            key={index}
            className="flex items-center justify-center transition-all duration-1000"
          >
            <Matrix
              rows={7}
              cols={7}
              frames={getFramesForMatrix(index)}
              pattern={getPatternForMatrix(index)}
              fps={getFps(index)}
              size={10}
              gap={2}
              ariaLabel={`Matrix ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
function createUnifiedPattern(frameIndex: number): Frame[] {
  const totalRows = 21
  const totalCols = 21
  const pattern: number[][] = []

  for (let row = 0; row < totalRows; row++) {
    pattern[row] = []
    for (let col = 0; col < totalCols; col++) {
      const centerX = totalCols / 2
      const centerY = totalRows / 2
      const distance = Math.sqrt(
        Math.pow(col - centerX, 2) + Math.pow(row - centerY, 2)
      )
      const wave = Math.sin(distance * 0.5 - frameIndex * 0.2)
      const value = (wave + 1) / 2
      pattern[row][col] = value
    }
  }

  const matrices: Frame[] = []
  for (let matrixRow = 0; matrixRow < 3; matrixRow++) {
    for (let matrixCol = 0; matrixCol < 3; matrixCol++) {
      const matrixFrame: Frame = []
      for (let row = 0; row < 7; row++) {
        matrixFrame[row] = []
        for (let col = 0; col < 7; col++) {
          const globalRow = matrixRow * 7 + row
          const globalCol = matrixCol * 7 + col
          matrixFrame[row][col] = pattern[globalRow][globalCol]
        }
      }
      matrices.push(matrixFrame)
    }
  }

  return matrices
}

const elevenLogo: Frame[] = (() => {
  const frames: Frame[] = []
  const totalFrames = 30

  for (let f = 0; f < totalFrames; f++) {
    const frame: Frame = Array(7)
      .fill(0)
      .map(() => Array(7).fill(0))

    const phase = (f / totalFrames) * Math.PI * 2
    const intensity = ((Math.sin(phase) + 1) / 2) * 0.3 + 0.7

    for (let r = 1; r <= 5; r++) {
      frame[r][2] = intensity
      frame[r][4] = intensity
    }

    frames.push(frame)
  }
  return frames
})()

const sandTimer: Frame[] = (() => {
  const frames: Frame[] = []
  const totalFrames = 60

  for (let f = 0; f < totalFrames; f++) {
    const frame: Frame = Array(7)
      .fill(0)
      .map(() => Array(7).fill(0))

    frame[0][2] = 1
    frame[0][3] = 1
    frame[0][4] = 1
    frame[1][2] = 1
    frame[1][4] = 1
    frame[5][2] = 1
    frame[5][4] = 1
    frame[6][2] = 1
    frame[6][3] = 1
    frame[6][4] = 1

    const progress = f / totalFrames

    const topSand = Math.floor((1 - progress) * 8)
    for (let i = 0; i < topSand; i++) {
      if (i < 3) frame[1][3] = 1
      if (i >= 3) frame[2][3] = 1
    }

    const bottomSand = Math.floor(progress * 8)
    for (let i = 0; i < bottomSand; i++) {
      if (i < 3) frame[5][3] = 1
      if (i >= 3 && i < 6) frame[4][3] = 1
      if (i >= 6) frame[3][3] = 0.5
    }

    frames.push(frame)
  }
  return frames
})()

const spinner: Frame[] = (() => {
  const frames: Frame[] = []
  const segments = 8

  for (let f = 0; f < segments; f++) {
    const frame: Frame = Array(7)
      .fill(0)
      .map(() => Array(7).fill(0))

    const positions = [
      [1, 3],
      [1, 4],
      [2, 5],
      [3, 5],
      [4, 5],
      [5, 4],
      [5, 3],
      [5, 2],
      [4, 1],
      [3, 1],
      [2, 1],
      [1, 2],
    ]

    for (let i = 0; i < 3; i++) {
      const idx = (f + i) % positions.length
      const [r, c] = positions[idx]
      frame[r][c] = 1 - i * 0.3
    }

    frames.push(frame)
  }
  return frames
})()

const corners: Frame[] = (() => {
  const frames: Frame[] = []
  for (let i = 0; i < 16; i++) {
    const frame: Frame = Array(7)
      .fill(0)
      .map(() => Array(7).fill(0))
    const progress = i / 16

    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const distFromCorner = Math.min(
          Math.sqrt(r * r + c * c),
          Math.sqrt(r * r + (6 - c) * (6 - c)),
          Math.sqrt((6 - r) * (6 - r) + c * c),
          Math.sqrt((6 - r) * (6 - r) + (6 - c) * (6 - c))
        )
        const threshold = progress * 8
        if (distFromCorner <= threshold) {
          frame[r][c] = Math.max(0, 1 - Math.abs(distFromCorner - threshold))
        }
      }
    }
    frames.push(frame)
  }
  return frames
})()

const sweep: Frame[] = (() => {
  const frames: Frame[] = []
  for (let i = 0; i < 14; i++) {
    const frame: Frame = Array(7)
      .fill(0)
      .map(() => Array(7).fill(0))
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r + c === i) {
          frame[r][c] = 1
        } else if (r + c === i - 1) {
          frame[r][c] = 0.5
        } else if (r + c === i + 1) {
          frame[r][c] = 0.5
        }
      }
    }
    frames.push(frame)
  }
  return frames
})()

const expand: Frame[] = (() => {
  const frames: Frame[] = []
  for (let i = 0; i <= 6; i++) {
    const frame: Frame = Array(7)
      .fill(0)
      .map(() => Array(7).fill(0))
    for (let r = 3 - i; r <= 3 + i; r++) {
      for (let c = 3 - i; c <= 3 + i; c++) {
        if (r >= 0 && r < 7 && c >= 0 && c < 7) {
          if (r === 3 - i || r === 3 + i || c === 3 - i || c === 3 + i) {
            frame[r][c] = 1
          }
        }
      }
    }
    frames.push(frame)
  }
  for (let i = 5; i >= 0; i--) {
    const frame: Frame = Array(7)
      .fill(0)
      .map(() => Array(7).fill(0))
    for (let r = 3 - i; r <= 3 + i; r++) {
      for (let c = 3 - i; c <= 3 + i; c++) {
        if (r >= 0 && r < 7 && c >= 0 && c < 7) {
          if (r === 3 - i || r === 3 + i || c === 3 - i || c === 3 + i) {
            frame[r][c] = 1
          }
        }
      }
    }
    frames.push(frame)
  }
  return frames
})()

const burst: Frame[] = (() => {
  const frames: Frame[] = []
  for (let f = 0; f < 8; f++) {
    const frame: Frame = Array(7)
      .fill(0)
      .map(() => Array(7).fill(0))

    const intensity = f < 4 ? f / 3 : (7 - f) / 3

    if (f < 6) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const distance = Math.sqrt(Math.pow(r - 3, 2) + Math.pow(c - 3, 2))
          if (Math.abs(distance - f * 0.8) < 1.2) {
            frame[r][c] = intensity
          }
        }
      }
    }

    frames.push(frame)
  }
  return frames
})()

function createExpandedLogo(progress: number): Frame[] {
  const matrices: Frame[] = []

  for (let matrixIdx = 0; matrixIdx < 9; matrixIdx++) {
    const frame: Frame = Array(7)
      .fill(0)
      .map(() => Array(7).fill(0))
    matrices.push(frame)
  }

  const easeProgress =
    progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2

  if (easeProgress < 0.3) {
    const centerMatrix = matrices[4]
    for (let r = 1; r <= 5; r++) {
      centerMatrix[r][2] = 1
      centerMatrix[r][4] = 1
    }
    return matrices
  }

  const expandProgress = (easeProgress - 0.3) / 0.7

  for (let globalRow = 0; globalRow < 21; globalRow++) {
    for (let globalCol = 0; globalCol < 21; globalCol++) {
      const matrixRow = Math.floor(globalRow / 7)
      const matrixCol = Math.floor(globalCol / 7)
      const matrixIdx = matrixRow * 3 + matrixCol
      const localRow = globalRow % 7
      const localCol = globalCol % 7

      const leftBarStart = Math.floor(9 + (5 - 9) * expandProgress)
      const leftBarEnd = Math.floor(9 + (7 - 9) * expandProgress)
      const rightBarStart = Math.floor(11 + (13 - 11) * expandProgress)
      const rightBarEnd = Math.floor(11 + (15 - 11) * expandProgress)

      const isLeftBar = globalCol >= leftBarStart && globalCol <= leftBarEnd
      const isRightBar = globalCol >= rightBarStart && globalCol <= rightBarEnd
      const inVerticalRange = globalRow >= 4 && globalRow <= 16

      if ((isLeftBar || isRightBar) && inVerticalRange) {
        matrices[matrixIdx][localRow][localCol] = 1
      }
    }
  }

  return matrices
}

function createCollapseEffect(progress: number): Frame[] {
  const matrices: Frame[] = []

  for (let matrixIdx = 0; matrixIdx < 9; matrixIdx++) {
    const frame: Frame = Array(7)
      .fill(0)
      .map(() => Array(7).fill(0))
    matrices.push(frame)
  }

  const easeProgress =
    progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2

  if (easeProgress < 0.4) {
    const collapseProgress = easeProgress / 0.4

    for (let globalRow = 0; globalRow < 21; globalRow++) {
      for (let globalCol = 0; globalCol < 21; globalCol++) {
        const matrixRow = Math.floor(globalRow / 7)
        const matrixCol = Math.floor(globalCol / 7)
        const matrixIdx = matrixRow * 3 + matrixCol
        const localRow = globalRow % 7
        const localCol = globalCol % 7

        const leftBarStart = Math.floor(5 + (9 - 5) * collapseProgress)
        const leftBarEnd = Math.floor(7 + (9 - 7) * collapseProgress)
        const rightBarStart = Math.floor(13 + (11 - 13) * collapseProgress)
        const rightBarEnd = Math.floor(15 + (11 - 15) * collapseProgress)

        const isLeftBar = globalCol >= leftBarStart && globalCol <= leftBarEnd
        const isRightBar =
          globalCol >= rightBarStart && globalCol <= rightBarEnd
        const inVerticalRange = globalRow >= 4 && globalRow <= 16

        if ((isLeftBar || isRightBar) && inVerticalRange) {
          matrices[matrixIdx][localRow][localCol] = 1
        }
      }
    }
  } else {
    const centerMatrix = matrices[4]
    const fadeProgress = (easeProgress - 0.4) / 0.6
    const brightness = 1 - fadeProgress

    for (let r = 1; r <= 5; r++) {
      centerMatrix[r][2] = brightness
      centerMatrix[r][4] = brightness
    }
  }

  return matrices
}

export default Example
