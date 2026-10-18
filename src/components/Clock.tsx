import type { CSSProperties } from "react"

import type { City } from "@/lib/cities"
import { dayFactor } from "@/lib/daylight"
import { handAngles, zonedTime } from "@/lib/time"

import styles from "./Clock.module.css"

type Size = "large" | "small"

const ticks = Array.from({ length: 60 }, (_, i) => {
  const angle = (i * 6 * Math.PI) / 180
  return { i, major: i % 5 === 0, sin: Math.sin(angle), cos: Math.cos(angle) }
})

const numerals: Record<Size, number[]> = {
  large: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  small: [12, 3, 6, 9],
}

function polar(radius: number, sin: number, cos: number) {
  return { x: 100 + radius * sin, y: 100 - radius * cos }
}

export function Clock({
  city,
  now,
  size,
}: {
  city: City
  now: Date
  size: Size
}) {
  const large = size === "large"
  const angles = handAngles(zonedTime(now, city.timeZone))
  const day = dayFactor(now, city.latitude, city.longitude)
  // Hands switch rather than cross-fade, where navy and cream contrast equally with the fading face.
  const night = day < 0.45

  return (
    <div
      className={`${styles.clock} ${large ? styles.large : styles.small} ${night ? styles.night : ""}`}
      style={{ "--d": day.toFixed(3) } as CSSProperties}
    >
      <svg viewBox="0 0 200 200" role="img" aria-label={city.name}>
        <circle cx="100" cy="100" r="100" className={styles.face} />
        {ticks
          .filter((t) => large || t.major)
          .map(({ i, major, sin, cos }) => {
            const outer = polar(large ? 93 : 92, sin, cos)
            const inner = polar(major ? (large ? 85 : 84) : 89.5, sin, cos)
            return (
              <line
                key={i}
                x1={outer.x}
                y1={outer.y}
                x2={inner.x}
                y2={inner.y}
                className={styles.tick}
                strokeWidth={major ? 2.6 : 1}
              />
            )
          })}
        {numerals[size].map((n) => {
          const angle = (n * 30 * Math.PI) / 180
          const { x, y } = polar(
            large ? 72 : 64,
            Math.sin(angle),
            Math.cos(angle)
          )
          return (
            <text key={n} x={x} y={y + 1} className={styles.numeral}>
              {n}
            </text>
          )
        })}
        <text x="100" y={large ? 136 : 134} className={styles.name}>
          {city.name}
        </text>
        <path
          className={`${styles.ink} ${styles.hand}`}
          style={{ transform: `rotate(${angles.hour}deg)` }}
          d="M95.2 108 L96.6 50 Q100 45 103.4 50 L104.8 108 Q100 111 95.2 108Z"
        />
        <path
          className={`${styles.ink} ${styles.hand}`}
          style={{ transform: `rotate(${angles.minute}deg)` }}
          d="M96.3 110 L97.6 22 Q100 18 102.4 22 L103.7 110 Q100 113 96.3 110Z"
        />
        <rect
          className={`${styles.second} ${styles.hand}`}
          style={{ transform: `rotate(${angles.second}deg)` }}
          x="99.55"
          y="16"
          width="0.9"
          height="100"
          rx="0.45"
        />
        <circle cx="100" cy="100" r="4.2" className={styles.ink} />
        <circle cx="100" cy="100" r="1.6" className={styles.second} />
      </svg>
    </div>
  )
}
