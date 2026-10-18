type Waypoint = { x: number; y: number; scale: number }

export type Field = {
  color: string
  left: number
  top: number
  size: number
  fade: number
  opacity: number
  path: Waypoint[]
  duration: number
  breath: number
  delay: number
  breathDelay: number
  reverse?: boolean
}

export type FieldState = {
  color: string
  x: number
  y: number
  radius: number
  alpha: number
}

const wp = (x: number, y: number, scale: number): Waypoint => ({ x, y, scale })

const paths = {
  a: [wp(0, 0, 1), wp(22, 14, 1.35), wp(-8, 26, 0.85), wp(18, -6, 1.2)],
  b: [wp(0, 0, 1), wp(-30, 10, 0.8), wp(-12, -18, 1.3), wp(-36, -4, 1.05)],
  c: [wp(0, 0, 1), wp(26, -20, 1.25), wp(40, 4, 0.9), wp(10, -30, 1.15)],
  d: [wp(0, 0, 1), wp(-24, -26, 1.4), wp(-40, -6, 0.95), wp(-14, -36, 1.1)],
  e: [wp(0, 0, 1), wp(-20, 24, 1.3), wp(16, 34, 0.9), wp(-6, 16, 1.2)],
}

// Positions are percentages of a box overhanging the viewport by 20% per side, sizes are in frame units, path offsets are in viewport percent and times in seconds.
export const fields: Field[] = [
  {
    color: "--field-a",
    left: -5,
    top: 2,
    size: 75,
    fade: 0.68,
    opacity: 1,
    path: paths.a,
    duration: 70,
    breath: 19,
    delay: 0,
    breathDelay: 0,
  },
  {
    color: "--field-b",
    left: 50,
    top: 18,
    size: 90,
    fade: 0.66,
    opacity: 0.55,
    path: paths.b,
    duration: 95,
    breath: 27,
    delay: -40,
    breathDelay: -9,
  },
  {
    color: "--field-c",
    left: 5,
    top: 52,
    size: 85,
    fade: 0.66,
    opacity: 1,
    path: paths.c,
    duration: 82,
    breath: 23,
    delay: -25,
    breathDelay: -4,
  },
  {
    color: "--field-d",
    left: 55,
    top: 62,
    size: 70,
    fade: 0.66,
    opacity: 1,
    path: paths.d,
    duration: 110,
    breath: 31,
    delay: -60,
    breathDelay: -15,
  },
  {
    color: "--field-e",
    left: 30,
    top: -6,
    size: 55,
    fade: 0.66,
    opacity: 0.8,
    path: paths.e,
    duration: 60,
    breath: 17,
    delay: -30,
    breathDelay: -6,
  },
  {
    color: "--field-d",
    left: 20,
    top: 34,
    size: 60,
    fade: 0.64,
    opacity: 0.7,
    path: paths.c,
    duration: 88,
    breath: 29,
    delay: -70,
    breathDelay: -20,
    reverse: true,
  },
  {
    color: "--field-b",
    left: -10,
    top: 76,
    size: 65,
    fade: 0.64,
    opacity: 0.45,
    path: paths.a,
    duration: 101,
    breath: 21,
    delay: -15,
    breathDelay: -11,
    reverse: true,
  },
]

const OVERHANG = 0.2
const MIN_BREATH = 0.55

function ease(t: number): number {
  return t * t * (3 - 2 * t)
}

// Progress through an alternating loop, as CSS animation-direction: alternate computes it.
export function alternating(
  seconds: number,
  duration: number,
  delay: number,
  reverse = false
): number {
  const elapsed = (seconds - delay) / duration
  const iteration = Math.floor(elapsed)
  const progress = elapsed - iteration
  const backwards = (Math.abs(iteration) % 2 === 1) !== reverse
  return backwards ? 1 - progress : progress
}

function along(path: Waypoint[], progress: number): Waypoint {
  const segments = path.length - 1
  const index = Math.min(Math.floor(progress * segments), segments - 1)
  const local = ease(progress * segments - index)
  const from = path[index]
  const to = path[index + 1]
  return {
    x: from.x + (to.x - from.x) * local,
    y: from.y + (to.y - from.y) * local,
    scale: from.scale + (to.scale - from.scale) * local,
  }
}

export function fieldState(
  field: Field,
  seconds: number,
  width: number,
  height: number
): FieldState {
  const unit = Math.max(width / 100, (0.5625 * height) / 100)
  const size = field.size * unit
  const offset = along(
    field.path,
    alternating(seconds, field.duration, field.delay, field.reverse)
  )
  const breath = ease(alternating(seconds, field.breath, field.breathDelay))
  const boxWidth = width * (1 + 2 * OVERHANG)
  const boxHeight = height * (1 + 2 * OVERHANG)

  return {
    color: field.color,
    x:
      -OVERHANG * width +
      (field.left / 100) * boxWidth +
      size / 2 +
      (offset.x / 100) * width,
    y:
      -OVERHANG * height +
      (field.top / 100) * boxHeight +
      size / 2 +
      (offset.y / 100) * height,
    // CSS radial-gradient(circle) reaches the farthest corner, so its stops scale from half the diagonal.
    radius: (size / Math.SQRT2) * offset.scale * field.fade,
    alpha: field.opacity * (1 - (1 - MIN_BREATH) * breath),
  }
}
