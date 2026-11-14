import { describe, expect, it, vi } from 'vitest'

vi.mock('time-card-scanner', () => ({ TimeCardScanner: {} }))

import { parseRow, parseSprintTime, scanToCheckpoints, scanToSprintTests } from '../../src/lib/scanCard'
import { CheckpointTypes } from '../../src/models/timekeeper'
import { toImagePath } from '../../src/lib/photos'

describe('Time Card Scanning', () => {
  describe('Time Keepers', () => {
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
  })
  
  describe('Sprints', () => {
    describe('parseSprintTime', () => {
      it.each([
        [['1230'], 12, 30, 0],
        [['153'], 1, 53, 0],
        [['123015'], 12, 30, 15],
        [['92629'], 9, 26, 29],
        [['9:26'], 9, 26, 0],
        [['12:30:15'], 12, 30, 15],
        [['9:5:7'], 9, 5, 7],
        [['9:26', '29'], 9, 26, 29],
        [['158', '26'], 1, 58, 26],
        [['12:30', ':15'], 12, 30, 15],
        [['2:2830'], 2, 28, 30],
        [['12:2830'], 12, 28, 30] 
      ])('%j', (parts, hour, minute, second) => {
        expect(parseSprintTime(...parts)).toEqual({ hour, minute, second })
      })

      it.each([
        [['']],
        [['12']],
        [['1234567']],
        [['12:345']],
        [['2460']],
        [['1275']],
        [['12:30:75']],
      ])('unreadable %j gives NaN', (parts) => {
        const t = parseSprintTime(...parts)
        expect(t.hour).toBeNaN()
        expect(t.minute).toBeNaN()
        expect(t.second).toBeNaN()
      })
    })

    describe('scanToSprintTests', () => {
      const row = (c1 = '', c2 = '', c3 = '') => ({ c1, c2, c3 })

      it('maps c1 to enter and c2+c3 to exit', () => {
        expect(scanToSprintTests([row('153', '158', '26')])).toEqual([
          { enter: { hour: 1, minute: 53, second: 0 }, exit: { hour: 1, minute: 58, second: 26 } },
        ])
      })

      it('trims trailing empty rows', () => {
        expect(scanToSprintTests([row('153', '158', '26'), row(), row()])).toHaveLength(1)
      })

      it('returns [] when every row is empty', () => {
        expect(scanToSprintTests([row(), row()])).toEqual([])
      })

      it('keeps an empty row in the middle as an all-NaN test', () => {
        const tests = scanToSprintTests([row('153', '158', '26'), row(), row('200', '205', '10')])
        expect(tests).toHaveLength(3)
        for (const t of [tests[1]!.enter, tests[1]!.exit]) {
          expect(t.hour).toBeNaN()
          expect(t.minute).toBeNaN()
          expect(t.second).toBeNaN()
        }
      })
    })
  })
  describe('Image path handling', () => {
    it('keeps only the file name under <raceId>/scans', () => {
      expect(toImagePath('abc', '/var/mobile/Containers/Data/Application/X/Documents/abc/scans/timecard-1.jpg'))
        .toBe('abc/scans/timecard-1.jpg')
      expect(toImagePath('abc', '/data/user/0/app/files/abc/scans/timecard-2.jpg'))
        .toBe('abc/scans/timecard-2.jpg')
    })
  })

})
