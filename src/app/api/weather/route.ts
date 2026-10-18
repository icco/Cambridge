import { cambridge } from "@/lib/cities"
import { fetchWeather } from "@/lib/weather"

export async function GET() {
  try {
    const weather = await fetchWeather(cambridge.latitude, cambridge.longitude)
    return Response.json(weather, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("weather fetch failed", error)
    return Response.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    )
  }
}
