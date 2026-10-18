# Cambridge Clock

An analog world clock art piece for a 27" portrait screen in London. It shows London, San Francisco, New York, and Sydney, shades each face by that city's daylight, and writes London's date and the current CB4 3QF weather in Fahrenheit at the top.

## Install

```sh
nvm use
npm install --global pnpm@11.2.2
export NODE_AUTH_TOKEN="$(gh auth token)"
printf '%s\n' '//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}' >> ~/.npmrc
pnpm install --frozen-lockfile
```

`NODE_AUTH_TOKEN` needs `read:packages` for `@icco/react-common` from GitHub Packages.

## Usage

```sh
pnpm dev
```

Open <http://localhost:8080> in a 9:16 window, or point a kiosk browser at it. On other aspect ratios the clocks stay in a centred 9:16 frame and the backdrop fills the rest.

To run the container:

```sh
docker build --secret id=npm_token,env=NODE_AUTH_TOKEN -t cambridge .
docker run -p 8080:8080 cambridge
```

## Commands

| Command           | Purpose                                              |
| ----------------- | ---------------------------------------------------- |
| `pnpm dev`        | Development server on port 8080                      |
| `pnpm check`      | ESLint, strict type checking, and formatting checks  |
| `pnpm test`       | Unit tests for time, daylight, weather, and backdrop |
| `pnpm build`      | Production build with standalone output              |
| `pnpm test:smoke` | Start the production server and check routes         |

## How it works

- `src/lib/time.ts` reads each city's time with the built-in `Temporal` API (Chrome 144+, Node 26), so daylight saving follows the browser's time zone data.
- `src/lib/daylight.ts` blends each face from day to night across civil twilight using [suncalc](https://github.com/mourner/suncalc).
- `src/components/ClockWall.tsx` runs one timer aligned to the second and reloads the page daily at 04:00 London time.
- `src/app/api/weather/route.ts` fetches current conditions from [Open-Meteo](https://open-meteo.com/en/docs) with the `openmeteo` SDK; `src/components/DateLine.tsx` polls it every 15 minutes.
- `src/components/Backdrop.tsx` draws the backdrop into one canvas at 1/8 resolution and stretches it to the viewport, so GPU memory stays flat on large screens. It darkens with Cambridge's daylight and stops animating under reduced motion.

Design notes and tasks live in [Notion](https://app.notion.com/p/3fc06c4aee27809c92baf9456682694e).
