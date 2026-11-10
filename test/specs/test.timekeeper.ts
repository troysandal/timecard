import { describe, expect, it } from 'vitest'
import {
    areEqual, TimeKeeperEnduro, Start, Known, Secret, Emergency, ScoreFormat, type Checkpoint
} from '../../src/models/timekeeper'

const tk = (cps: Checkpoint[] = [], minute = 17): TimeKeeperEnduro => {
    const e = new TimeKeeperEnduro(minute)
    e.checkpoints = cps
    return e
}

describe('TimeKeeper', () => {
    describe('model constructors', () => {
        it('TimeKeeperEnduro defaults to AMA format with no checkpoints', () => {
            const e = new TimeKeeperEnduro(5)
            expect(e).toMatchObject({ riderMinute: 5, format: ScoreFormat.AMA_National, checkpoints: [] })
            expect(new TimeKeeperEnduro(5, ScoreFormat.NETRA_BrandX).format).toBe(ScoreFormat.NETRA_BrandX)
        })

        it('checkpoints default to not dropped; Start, Known, and Secret have 0 seconds', () => {
            for (const C of [Start, Known, Secret]) {
                expect(new C(4)).toMatchObject({ minute: 4, seconds: 0, drop: false })
                expect(new C(4, true).drop).toBe(true)
            }
            expect(new Emergency(4, 30)).toMatchObject({ minute: 4, seconds: 30, drop: false })
            expect(new Emergency(4, 30, true).drop).toBe(true)
        })
    })

    describe('areEqual', () => {
        it('returns true for identical enduros, including plain-object copies', () => {
            expect(areEqual(tk(), tk())).toBe(true)
            const cps = () => [new Start(1), new Emergency(2, 30), new Known(3, true)]
            expect(areEqual(tk(cps()), tk(cps()))).toBe(true)
            expect(areEqual(tk(cps()), structuredClone(tk(cps())))).toBe(true)
        })

        it('treats NaN fields as equal to NaN but not to numbers', () => {
            expect(areEqual(tk([], NaN), tk([], NaN))).toBe(true)
            expect(areEqual(tk([new Emergency(NaN, NaN)]), tk([new Emergency(NaN, NaN)]))).toBe(true)
            expect(areEqual(tk([], NaN), tk([], 17))).toBe(false)
            expect(areEqual(tk([new Known(NaN)]), tk([new Known(1)]))).toBe(false)
        })

        it.each([
            ['rider minute differs',            tk([], 17),                       tk([], 18)],
            ['format differs',                  tk(),                             Object.assign(tk(), { format: ScoreFormat.NETRA_BrandX })],
            ['left has more checkpoints',       tk([new Start(1)]),               tk()],
            ['right has more checkpoints',      tk(),                             tk([new Start(1)])],
            ['checkpoint type differs',         tk([new Known(1)]),               tk([new Secret(1)])],
            ['checkpoint minute differs',       tk([new Known(1)]),               tk([new Known(2)])],
            ['checkpoint seconds differ',       tk([new Emergency(1, 30)]),       tk([new Emergency(1, 31)])],
            ['checkpoint drop flag differs',    tk([new Known(1, true)]),         tk([new Known(1)])],
            ['checkpoint order differs',        tk([new Start(1), new Known(2)]), tk([new Known(2), new Start(1)])],
        ])('returns false when %s', (_, l, r) => {
            expect(areEqual(l, r)).toBe(false)
            expect(areEqual(r, l)).toBe(false)
        })
    })
})
