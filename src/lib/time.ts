export type ClockTime = { hours: number; minutes: number; seconds: number }

export type HandAngles = { hour: number; minute: number; second: number }

const timeFormats = new Map<string, Intl.DateTimeFormat>()
const dateFormats = new Map<string, Intl.DateTimeFormat>()

function cached(
  cache: Map<string, Intl.DateTimeFormat>,
  timeZone: string,
  create: () => Intl.DateTimeFormat
) {
  let format = cache.get(timeZone)
  if (!format) {
    format = create()
    cache.set(timeZone, format)
  }
  return format
}

export function zonedTime(date: Date, timeZone: string): ClockTime {
  const format = cached(
    timeFormats,
    timeZone,
    () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hourCycle: "h23",
      })
  )
  const parts = Object.fromEntries(
    format.formatToParts(date).map((part) => [part.type, part.value])
  )
  return {
    hours: Number(parts.hour),
    minutes: Number(parts.minute),
    seconds: Number(parts.second),
  }
}

export function isoDate(date: Date, timeZone: string): string {
  const format = cached(
    dateFormats,
    timeZone,
    () =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
  )
  return format.format(date)
}

export function handAngles({ hours, minutes, seconds }: ClockTime): HandAngles {
  return {
    hour: (hours % 12) * 30 + minutes * 0.5,
    minute: minutes * 6 + seconds * 0.1,
    second: seconds * 6,
  }
}

export function msUntilNextSecond(now: number): number {
  return 1000 - (now % 1000)
}
