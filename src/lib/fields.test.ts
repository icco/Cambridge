import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { alternating, fields, fieldState } from "./fields.ts"

describe("alternating", () => {
  it("runs forward then back", () => {
    assert.equal(alternating(25, 100, 0), 0.25)
    assert.equal(alternating(125, 100, 0), 0.75)
  })

  it("treats a negative delay as time already elapsed", () => {
    assert.equal(alternating(0, 100, -40), 0.4)
  })

  it("starts backwards when reversed", () => {
    assert.equal(alternating(25, 100, 0, true), 0.75)
  })
})

describe("fieldState", () => {
  it("matches the CSS layout at the start of the loop", () => {
    const state = fieldState(fields[0], 0, 1080, 1920)
    assert.ok(Math.abs(state.x - 113.4) < 0.01, `x ${state.x}`)
    assert.ok(Math.abs(state.y - 74.76) < 0.01, `y ${state.y}`)
    assert.ok(Math.abs(state.radius - 389.47) < 0.01, `r ${state.radius}`)
    assert.equal(state.alpha, 1)
  })

  it("breathes down to 55% opacity", () => {
    assert.ok(
      Math.abs(fieldState(fields[0], 19, 1080, 1920).alpha - 0.55) < 1e-9
    )
  })
})
