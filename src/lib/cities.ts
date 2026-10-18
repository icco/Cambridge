export type City = {
  name: string
  timeZone: string
  latitude: number
  longitude: number
}

export const home: City = {
  name: "London",
  timeZone: "Europe/London",
  latitude: 51.5072,
  longitude: -0.1276,
}

export const away: City[] = [
  {
    name: "San Francisco",
    timeZone: "America/Los_Angeles",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    name: "New York",
    timeZone: "America/New_York",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Sydney",
    timeZone: "Australia/Sydney",
    latitude: -33.8688,
    longitude: 151.2093,
  },
]

export const cambridge: City = {
  name: "Cambridge",
  timeZone: "Europe/London",
  latitude: 52.2165,
  longitude: 0.1091,
}
