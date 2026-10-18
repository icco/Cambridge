"use client"

import { type CSSProperties, useEffect, useState } from "react"

import { cambridge } from "@/lib/cities"
import { dayFactor } from "@/lib/daylight"

import styles from "./Backdrop.module.css"

const MINUTE_MS = 60 * 1000

function cambridgeDay() {
  return dayFactor(new Date(), cambridge.latitude, cambridge.longitude)
}

export function Backdrop() {
  const [day, setDay] = useState<number | null>(null)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const update = () => {
      setDay(cambridgeDay())
      timer = setTimeout(update, MINUTE_MS)
    }

    timer = setTimeout(update, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={styles.backdrop} aria-hidden="true">
      {day !== null && (
        <div
          className={styles.dusk}
          style={{ "--day": day } as CSSProperties}
        />
      )}
      <div className={styles.fields}>
        <div className={styles.field} />
        <div className={styles.field} />
        <div className={styles.field} />
        <div className={styles.field} />
        <div className={styles.field} />
        <div className={styles.field} />
        <div className={styles.field} />
      </div>
      {day !== null && (
        <div
          className={styles.veil}
          style={{ "--day": day } as CSSProperties}
        />
      )}
      <div className={styles.grain} />
    </div>
  )
}
