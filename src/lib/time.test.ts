import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { handAngles, isoDate, msUntilNextSecond, zonedTime } from "./time.ts"

describe("zonedTime", () => {
  it("reads midnight as hour 0", () => {
    assert.deepEqual(
      zonedTime(new Date("2026-01-15T00:00:05Z"), "Europe/London"),
      { hours: 0, minutes: 0, seconds: 5 }
    )
  })

  it("follows London across BST", () => {
    assert.equal(
      zonedTime(new Date("2026-03-29T00:59:00Z"), "Europe/London").hours,
      0
    )
    assert.equal(
      zonedTime(new Date("2026-03-29T01:00:00Z"), "Europe/London").hours,
      2
    )
  })

  it("follows US daylight saving", () => {
    assert.equal(
      zonedTime(new Date("2026-03-08T09:59:00Z"), "America/Los_Angeles")
        .hours,
      1
    )
    assert.equal(
      zonedTime(new Date("2026-03-08T10:00:00Z"), "America/Los_Angeles")
        .hours,
      3
    )
    assert.equal(
      zonedTime(new Date("2026-11-01T06:00:00Z"), "America/New_York").hours,
      1
    )
  })

  it("follows Sydney's southern hemisphere DST", () => {
    assert.equal(
      zonedTime(new Date("2026-04-04T15:59:00Z"), "Australia/Sydney").hours,
      2
    )
    assert.equal(
      zonedTime(new Date("2026-04-04T16:00:00Z"), "Australia/Sydney").hours,
      2
    )
    assert.equal(
      zonedTime(new Date("2026-10-03T16:00:00Z"), "Australia/Sydney").hours,
      3
    )
  })
})

describe("isoDate", () => {
  it("formats the zone's own date", () => {
    const instant = new Date("2026-10-18T14:00:00Z")
    assert.equal(isoDate(instant, "Europe/London"), "2026-10-18")
    assert.equal(isoDate(instant, "Australia/Sydney"), "2026-10-19")
  })
})

describe("handAngles", () => {
  it("points every hand at 12 at midnight", () => {
    assert.deepEqual(handAngles({ hours: 0, minutes: 0, seconds: 0 }), {
      hour: 0,
      minute: 0,
      second: 0,
    })
  })

  it("moves the hour hand between numerals", () => {
    assert.deepEqual(handAngles({ hours: 15, minutes: 30, seconds: 30 }), {
      hour: 105,
      minute: 183,
      second: 180,
    })
  })
})

describe("msUntilNextSecond", () => {
  it("waits for the next whole second", () => {
    assert.equal(msUntilNextSecond(1_000_250), 750)
    assert.equal(msUntilNextSecond(1_000_000), 1000)
  })
})
