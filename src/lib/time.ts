export type ClockTime = { hours: number; minutes: number; seconds: number }

export type HandAngles = { hour: number; minute: number; second: number }

function zoned(date: Date, timeZone: string): Temporal.ZonedDateTime {
  return Temporal.Instant.fromEpochMilliseconds(
    date.getTime()
  ).toZonedDateTimeISO(timeZone)
}

export function zonedTime(date: Date, timeZone: string): ClockTime {
  const { hour, minute, second } = zoned(date, timeZone)
  return { hours: hour, minutes: minute, seconds: second }
}

export function isoDate(date: Date, timeZone: string): string {
  return zoned(date, timeZone).toPlainDate().toString()
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
