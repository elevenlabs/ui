import assert from "node:assert/strict"
import { test } from "node:test"
import { renderToStaticMarkup } from "react-dom/server"

import { Matrix } from "./matrix"

function gradientStops(html: string): Map<string, string> {
  const stops = new Map<string, string>()
  const gradients = html.matchAll(
    /<radialGradient\b([^>]*)>([\s\S]*?)<\/radialGradient>/g
  )

  for (const match of gradients) {
    const id = match[1].match(/\bid="([^"]+)"/)?.[1]
    const stopColor = match[2].match(/\bstop-color="([^"]+)"/)?.[1]
    if (id && stopColor) stops.set(id, stopColor)
  }

  return stops
}

function circleFills(html: string): string[] {
  return [...html.matchAll(/<circle\b[^>]*>/g)].map((match) => {
    return match[0].match(/\bfill="([^"]+)"/)?.[1] ?? ""
  })
}

function fillColor(
  fills: string[],
  stops: Map<string, string>,
  index: number
): string | undefined {
  const id = fills[index]?.match(/url\(#([^)]+)\)/)?.[1]
  return id ? stops.get(id) : undefined
}

test("lit cells use their own colors", () => {
  const html = renderToStaticMarkup(
    <Matrix
      rows={1}
      cols={3}
      pattern={[[1, 1, 1]]}
      colors={[["#ff0000", "#00ff00", "#ff0000"]]}
    />
  )
  const stops = gradientStops(html)
  const fills = circleFills(html)

  assert.equal(fillColor(fills, stops, 0), "#ff0000")
  assert.equal(fillColor(fills, stops, 1), "#00ff00")
  assert.equal(fillColor(fills, stops, 2), "#ff0000")
  assert.equal(fills[0], fills[2])
})

test("unlit cells keep the off palette when a dot color is set", () => {
  const html = renderToStaticMarkup(
    <Matrix
      rows={1}
      cols={2}
      pattern={[[0, 1]]}
      colors={[["#00ff00", "#ff0000"]]}
    />
  )
  const stops = gradientStops(html)
  const fills = circleFills(html)

  assert.equal(fillColor(fills, stops, 0), "var(--muted-foreground)")
  assert.equal(fillColor(fills, stops, 1), "#ff0000")
})

test("blank dot colors fall back to palette.on", () => {
  const html = renderToStaticMarkup(
    <Matrix
      rows={1}
      cols={3}
      pattern={[[1, 1, 1]]}
      colors={[[null, "  ", "#abcdef"]]}
      palette={{ on: "red", off: "black" }}
    />
  )
  const stops = gradientStops(html)
  const fills = circleFills(html)

  assert.equal(fillColor(fills, stops, 0), "var(--matrix-on)")
  assert.equal(fillColor(fills, stops, 1), "var(--matrix-on)")
  assert.equal(fillColor(fills, stops, 2), "#abcdef")
  assert.match(html, /--matrix-on:red/)
})

test("omitting colors keeps the shared on palette", () => {
  const html = renderToStaticMarkup(
    <Matrix rows={1} cols={1} pattern={[[1]]} />
  )
  const stops = gradientStops(html)
  const fills = circleFills(html)

  assert.equal(fillColor(fills, stops, 0), "var(--matrix-on)")
  assert.equal(
    [...stops.values()].some((color) => color.startsWith("#")),
    false
  )
})

test("each matrix owns its gradients", () => {
  const html = renderToStaticMarkup(
    <>
      <Matrix
        rows={1}
        cols={1}
        pattern={[[1]]}
        palette={{ on: "red", off: "black" }}
      />
      <Matrix
        rows={1}
        cols={1}
        pattern={[[1]]}
        palette={{ on: "blue", off: "black" }}
      />
    </>
  )
  const ids = [...html.matchAll(/\bid="([^"]+-on)"/g)].map((match) => match[1])

  assert.equal(ids.length, 2)
  assert.notEqual(ids[0], ids[1])
  assert.match(html, /--matrix-on:red/)
  assert.match(html, /--matrix-on:blue/)
})

test("vu mode colors only the lit dots", () => {
  const colors = Array.from({ length: 7 }, () => ["#ff0000", "#00ff00"])
  const html = renderToStaticMarkup(
    <Matrix rows={7} cols={2} mode="vu" levels={[1, 0]} colors={colors} />
  )
  const stops = gradientStops(html)
  const fills = circleFills(html)

  assert.equal(fills.length, 14)
  for (let row = 0; row < 7; row++) {
    assert.equal(fillColor(fills, stops, row * 2), "#ff0000")
    assert.equal(
      fillColor(fills, stops, row * 2 + 1),
      "var(--muted-foreground)"
    )
  }
})
