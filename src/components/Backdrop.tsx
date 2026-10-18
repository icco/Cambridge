"use client"

import { useEffect, useRef } from "react"

import { cambridge } from "@/lib/cities"
import { dayFactor } from "@/lib/daylight"
import { fields, fieldState } from "@/lib/fields"

import styles from "./Backdrop.module.css"

// The whole backdrop is one small canvas stretched to the viewport, so its GPU memory stays flat at any screen size; the soft gradients survive the upscale.
const RESOLUTION = 1 / 8
const FRAME_MS = 1000 / 30
const STILL_MS = 60 * 1000
// At night the wall goes deep under the fields so they glow, and a lighter veil over them tones them down.
const NIGHT_DUSK = 0.85
const NIGHT_VEIL = 0.3

type Palette = { wall: string; dusk: string; fields: string[] }

function token(style: CSSStyleDeclaration, name: string): string {
  const color = style.getPropertyValue(name).trim()
  if (!/^#[0-9a-f]{6}$/i.test(color)) {
    throw new Error(`${name} must be a #rrggbb colour, got "${color}"`)
  }
  return color
}

function draw(canvas: HTMLCanvasElement, palette: Palette, now: Date) {
  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("2d canvas context unavailable")
  }
  const { clientWidth: width, clientHeight: height } = canvas
  if (width === 0 || height === 0) return
  const pixelWidth = Math.max(1, Math.ceil(width * RESOLUTION))
  const pixelHeight = Math.max(1, Math.ceil(height * RESOLUTION))
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth
    canvas.height = pixelHeight
  }
  // Scale to the rounded-up backing size, not RESOLUTION, so the last pixel row and column are fully painted.
  context.setTransform(pixelWidth / width, 0, 0, pixelHeight / height, 0, 0)
  const night = 1 - dayFactor(now, cambridge.latitude, cambridge.longitude)
  const seconds = now.getTime() / 1000

  context.globalAlpha = 1
  context.fillStyle = palette.wall
  context.fillRect(0, 0, width, height)
  context.globalAlpha = night * NIGHT_DUSK
  context.fillStyle = palette.dusk
  context.fillRect(0, 0, width, height)

  fields.forEach((field, i) => {
    const { x, y, radius, alpha } = fieldState(field, seconds, width, height)
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, palette.fields[i])
    gradient.addColorStop(1, `${palette.fields[i]}00`)
    context.globalAlpha = alpha
    context.fillStyle = gradient
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2)
  })

  context.globalAlpha = night * NIGHT_VEIL
  context.fillStyle = palette.dusk
  context.fillRect(0, 0, width, height)
}

export function Backdrop() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const element = canvas.current
    if (!element) return
    const style = getComputedStyle(document.documentElement)
    const palette: Palette = {
      wall: token(style, "--wall"),
      dusk: token(style, "--dusk"),
      fields: fields.map((field) => token(style, field.color)),
    }
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches
    let frame = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    let last = -Infinity

    const render = (now: number) => {
      if (now - last >= FRAME_MS) {
        last = now
        draw(element, palette, new Date())
      }
      if (still) {
        timer = setTimeout(() => render(performance.now()), STILL_MS)
      } else {
        frame = requestAnimationFrame(render)
      }
    }

    frame = requestAnimationFrame(render)
    const resize = new ResizeObserver(() => {
      last = -Infinity
      if (still) draw(element, palette, new Date())
    })
    resize.observe(element)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      resize.disconnect()
    }
  }, [])

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <canvas ref={canvas} className={styles.canvas} />
      <div className={styles.grain} />
    </div>
  )
}
