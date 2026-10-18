import { fetchWeatherApi } from "openmeteo"

export type Weather = { temperature: number; description: string }

// WMO weather interpretation codes, as listed in https://open-meteo.com/en/docs
const descriptions: Record<number, string> = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Freezing fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  56: "Freezing drizzle",
  57: "Freezing drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light showers",
  81: "Showers",
  82: "Heavy showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with hail",
}

export function describeWeather(code: number): string {
  const description = descriptions[code]
  if (!description) {
    throw new Error(`unknown WMO weather code ${code}`)
  }
  return description
}

export function weatherLine({ temperature, description }: Weather): string {
  return `${description} · ${Math.round(temperature)}°F`
}

export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<Weather> {
  const [response] = await fetchWeatherApi(
    "https://api.open-meteo.com/v1/forecast",
    {
      latitude,
      longitude,
      current: "temperature_2m,weather_code",
      temperature_unit: "fahrenheit",
    }
  )
  const current = response.current()
  if (!current) {
    throw new Error("open-meteo returned no current conditions")
  }
  return {
    temperature: current.variables(0)!.value(),
    description: describeWeather(current.variables(1)!.value()),
  }
}
