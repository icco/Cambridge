# Cambridge Clock

An analog world clock art piece for a 27" portrait screen in London. It shows London, San Francisco, New York, and Sydney, shades each face by that city's daylight, and puts London's date in split-flap tiles at the top.

## Install

```sh
nvm use
npm install --global pnpm@11.2.2
export NODE_AUTH_TOKEN="$(gh auth token)"
pnpm install --frozen-lockfile
```

`NODE_AUTH_TOKEN` needs `read:packages` for `@icco/react-common` from GitHub Packages.

## Usage

```sh
pnpm dev
```

Open <http://localhost:8080> in a 9:16 window, or point a kiosk browser at it. The layout letterboxes on other aspect ratios.

To run the container:

```sh
docker build --secret id=npm_token,env=NODE_AUTH_TOKEN -t cambridge .
docker run -p 8080:8080 cambridge
```

## Commands

| Command           | Purpose                                             |
| ----------------- | --------------------------------------------------- |
| `pnpm dev`        | Development server on port 8080                     |
| `pnpm check`      | ESLint, strict type checking, and formatting checks |
| `pnpm test`       | Unit tests for time zones and daylight              |
| `pnpm build`      | Production build with standalone output             |
| `pnpm test:smoke` | Start the production server and check routes        |

## How it works

- `src/lib/time.ts` reads each city's time with `Intl.DateTimeFormat`, so daylight saving follows the browser's time zone data.
- `src/lib/daylight.ts` blends each face from day to night across civil twilight using [suncalc](https://github.com/mourner/suncalc).
- `src/components/ClockWall.tsx` runs one timer aligned to the second and reloads the page daily at 04:00 London time.
- The background animates only `transform` on gradient fields, which a Raspberry Pi can keep up with.

Design notes and tasks live in [Notion](https://app.notion.com/p/3fc06c4aee27809c92baf9456682694e).
