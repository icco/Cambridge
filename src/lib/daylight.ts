import { getPosition } from "suncalc"

// Civil twilight: fully night below -6 degrees, fully day above +6.
const TWILIGHT_DEGREES = 6

export function dayFactor(
  date: Date,
  latitude: number,
  longitude: number
): number {
  const { altitude } = getPosition(date, latitude, longitude)
  const factor = (altitude + TWILIGHT_DEGREES) / (2 * TWILIGHT_DEGREES)
  return Math.min(1, Math.max(0, factor))
}
