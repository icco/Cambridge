import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { dayFactor } from "./daylight.ts"

const london = [51.5072, -0.1276] as const
const sydney = [-33.8688, 151.2093] as const

describe("dayFactor", () => {
  it("is full day at London noon", () => {
    assert.equal(dayFactor(new Date("2026-06-21T12:00:00Z"), ...london), 1)
  })

  it("is full night at London midnight", () => {
    assert.equal(dayFactor(new Date("2026-12-21T00:00:00Z"), ...london), 0)
  })

  it("blends during twilight", () => {
    // London sunset on 2026-10-18 is around 17:00 UTC.
    const factor = dayFactor(new Date("2026-10-18T17:05:00Z"), ...london)
    assert.ok(factor > 0 && factor < 1, `got ${factor}`)
  })

  it("is day at Sydney's winter noon", () => {
    assert.equal(dayFactor(new Date("2026-06-21T02:00:00Z"), ...sydney), 1)
  })
})
