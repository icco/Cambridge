"use client"

import { useEffect, useState } from "react"

import { away, home } from "@/lib/cities"
import { msUntilNextSecond, zonedTime } from "@/lib/time"

import { Clock } from "./Clock"
import styles from "./ClockWall.module.css"
import { DateLine } from "./DateLine"

const RELOAD_HOUR = 4
const HOUR_MS = 60 * 60 * 1000

export function ClockWall() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const mountedAt = Date.now()
    let timer: ReturnType<typeof setTimeout>

    const tick = () => {
      const date = new Date()
      // A daily reload keeps a weeks-long kiosk session from accumulating state.
      if (
        date.getTime() - mountedAt > HOUR_MS &&
        zonedTime(date, home.timeZone).hours === RELOAD_HOUR
      ) {
        window.location.reload()
        return
      }
      setNow(date)
      timer = setTimeout(tick, msUntilNextSecond(date.getTime()))
    }

    timer = setTimeout(tick, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={styles.wall}>
      {now && (
        <>
          <DateLine now={now} />
          <div className={styles.home}>
            <Clock city={home} now={now} size="large" />
          </div>
          <div className={styles.away}>
            {away.map((city) => (
              <div key={city.timeZone} className={styles.city}>
                <Clock city={city} now={now} size="small" />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
