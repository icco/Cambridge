"use client"

import { useEffect, useState } from "react"

import { cambridge, home } from "@/lib/cities"
import { dayFactor } from "@/lib/daylight"
import { writtenDate } from "@/lib/time"
import { type Weather, weatherLine } from "@/lib/weather"

import styles from "./DateLine.module.css"

const WEATHER_MS = 15 * 60 * 1000

export function DateLine({ now }: { now: Date }) {
  const [weather, setWeather] = useState<Weather | null>(null)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const load = async () => {
      try {
        const response = await fetch("/api/weather")
        const body = await response.json()
        if (!response.ok) {
          throw new Error(body.error ?? `weather returned ${response.status}`)
        }
        setWeather(body as Weather)
      } catch (error) {
        // Keep showing the last reading; the next poll may succeed.
        console.error("weather update failed", error)
      }
      timer = setTimeout(load, WEATHER_MS)
    }

    timer = setTimeout(load, 0)
    return () => clearTimeout(timer)
  }, [])

  const { weekday, date } = writtenDate(now, home.timeZone)
  const night = dayFactor(now, cambridge.latitude, cambridge.longitude) < 0.45

  return (
    <div className={`${styles.date} ${night ? styles.night : ""}`}>
      <div className={styles.weekday}>{weekday}</div>
      <div className={styles.day}>{date}</div>
      {weather && <div className={styles.weather}>{weatherLine(weather)}</div>}
    </div>
  )
}
