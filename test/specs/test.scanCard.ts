import { describe, expect, it, vi } from 'vitest'

vi.mock('time-card-scanner', () => ({ TimeCardScanner: {} }))

import { parseRow, scanToCheckpoints } from '../../src/lib/scanCard'
import { CheckpointTypes } from '../../src/models/timekeeper'

const E = CheckpointTypes.Emergency
const S = CheckpointTypes.Secret

describe('parseRow', () => {
  it.each([
    ['12:30', '', E, 12, 30],
    ['12', ':30', E, 12, 30],
    ['12:', '30', E, 12, 30],
    ['12', '30', E, 12, 30],
    ['', '12:30', E, 12, 30],
    ['1230', '', E, 12, 30],
    ['123', '', S, 123, 30],
    ['105', '', S, 105, 30],
    ['1:23', '', E, 1, 23],
    ['12345', '', E, 123, 45],
    ['12::30', '', E, 12, 30],
    [':12:30:', '', E, 12, 30],
    ['12:5', '', E, 12, 5],
    ['45', '', S, 45, 30],
    ['72', '42', E, 72, 42],
    ['72', '', S, 72, 30],
    ['72:42', '', E, 72, 42],
    ['125:10', '', E, 125, 10],
  ])('c1=%j c2=%j', (c1, c2, type, minute, seconds) => {
    expect(parseRow(c1, c2)).toEqual({ type, minute, seconds, drop: false })
  })

  it.each([
    ['12:75', ''],
    ['1:2:3', ''],
    ['', ''],
    ['1275', ''],
  ])('falls back for c1=%j c2=%j', (c1, c2) => {
    const r = parseRow(c1, c2)
    expect(r.type).toBe(S)
    expect(r.minute).toBeNaN()
    expect(r.seconds).toBe(30)
    expect(r.drop).toBe(true)
  })
})

describe('scanToCheckpoints', () => {
  const row = (c1 = '', c2 = '', c3 = '') => ({ c1, c2, c3 })

  it('returns one check per row', () => {
    expect(scanToCheckpoints([row('5'), row('7')])).toHaveLength(2)
  })

  it('trims trailing empty rows', () => {
    expect(scanToCheckpoints([row('5'), row(), row()])).toHaveLength(1)
  })

  it('returns [] when every row is empty', () => {
    expect(scanToCheckpoints([row(), row()])).toEqual([])
  })

  it('keeps an empty row in the middle', () => {
    const checks = scanToCheckpoints([row('5'), row(), row('7')])
    expect(checks).toHaveLength(3)
    expect(checks[1]!.minute).toBeNaN()
    expect(checks[1]!.drop).toBe(true)
  })

  it('does not trim a trailing row that only has c3', () => {
    expect(scanToCheckpoints([row('5'), row('', '', '9')])).toHaveLength(2)
  })
})
