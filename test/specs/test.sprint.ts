import { describe, expect, it } from 'vitest'
import { SprintEnduro, SprintTest, SprintTestTime } from '../../src/models/sprint'
import { scoreString } from '../../src/lib/SprintUtil'

describe('Sprint Enduro', () => {
    function createTest(ih: number, im: number, is: number, oh: number, om: number, os: number): SprintTest {
        const enterTime = {
            hour: ih,
            minute: im,
            second: is
        }
        const exitTime = {
            hour: oh,
            minute: om,
            second: os
        }
        const result = SprintTest.fromTimes(enterTime, exitTime) as SprintTest
        return result
    }

    function scoreTest(ih: number, im: number, is: number, oh: number, om: number, os: number) {
        const test = createTest(ih, im, is, oh, om, os)
        return { score: test.score, scoreAsTime: scoreString(test.score) }
    }

        
    describe('Sprint Test Time', () => {
        it('computes times using raw hh:mm:ss', () => {
            // Yep - it doesn't enforce valid enter/exit
            const badTest = new SprintTest(
                new SprintTestTime(0, 0, 0), 
                new SprintTestTime(-1, 0, 0)
            )
            expect(badTest.score).to.equal(-3600)
            expect(createTest(0, 0, 0, 0, 0, 0).score).to.equal(0)
            expect(createTest(0, 0, 0, 0, 0, 1).score).to.equal(1)
            expect(createTest(0, 0, 0, 0, 1, 0).score).to.equal(60)
            expect(createTest(0, 0, 0, 1, 0, 0).score).to.equal(3600)
            expect(createTest(0, 0, 0, 2, 45, 3).score).to.equal(9903)

            expect(new SprintTestTime().seconds).to.equal(0)
            expect(new SprintTestTime(1, 2, 3).seconds).to.equal(3723)
            expect(new SprintTestTime(23, 59, 59).seconds).to.equal(86399)
            expect(new SprintTest().score).to.equal(0)
        })

        it('handles NaN', () => {
            const nanTest = new SprintTest(
                new SprintTestTime(NaN, NaN, NaN), 
                new SprintTestTime(NaN, NaN, NaN)
            )
            expect(nanTest.score).to.be.NaN
            expect(scoreString(nanTest.score)).to.equal('NaN:NaN:NaN')
        })
    })

    describe('Test Calculations', () => {
        it('handles empty time cards', () => {
            const enduro: SprintEnduro = new SprintEnduro()
            expect(enduro.score).toBeNaN()
            expect(scoreString(enduro.score)).to.equal('NaN:NaN:NaN')
        })

        it('detects bad hours', () => {
            expect(createTest(-1, 0, 0, 0, 30, 0)).to.not.exist
            expect(createTest(0, 0, 0, -1, 30, 0)).to.not.exist
            expect(createTest(24, 0, 0, 23, 30, 0)).to.not.exist
            expect(createTest(23, 0, 0, 24, 30, 0)).to.not.exist
        })

        it('detects bad minutes', () => {
            expect(createTest(0, -1, 0, 0, 0, 0)).to.not.exist
            expect(createTest(0, 0, 0, 0, -1, 0)).to.not.exist
            expect(createTest(0, 60, 0, 0, 0, 0)).to.not.exist
            expect(createTest(0, 0, 0, 0, 60, 0)).to.not.exist
        })

        it('detects bad seconds', () => {
            expect(createTest(0, 0, -1, 0, 0, 0)).to.not.exist
            expect(createTest(0, 0, 0, 0, 0, -1)).to.not.exist
            expect(createTest(0, 0, 60, 0, 0, 0)).to.not.exist
            expect(createTest(0, 0, 0, 0, 0, 60)).to.not.exist
        })

        // Known gap: validateTimeData only checks isNaN(sum) and range, so
        // non-integer / string components slip through. These document the
        // bug and will start failing (i.e. "pass") once validation is fixed.
        it.fails('rejects empty-string components', () => {
            expect(createTest(0, 0, 0, 0, 0, '' as any as number)).to.not.exist
        })

        it.fails('rejects numeric-string components', () => {
            expect(createTest(0, 0, 0, 0, 0, '5' as any as number)).to.not.exist
        })

        it.fails('rejects fractional components', () => {
            expect(createTest(0, 0, 0, 0, 0, 1.5)).to.not.exist
        })

        it('accepts upper-edge minute and second values', () => {
            expect(createTest(0, 59, 59, 23, 59, 59).score).to.equal(82800)
        })

        it('ensures exit time is after enter', () => {
            expect(createTest(0,0,0,0,0,1)).to.exist
            // am/pm support, e.g. 12pm, 1pm is ok
            expect(createTest(12, 0, 0, 1, 30, 0)).to.exist
            expect(createTest(22, 0, 0, 21, 30, 0)).to.not.exist
            expect(createTest(20, 0, 0, 0, 30, 0)).to.not.exist
            expect(createTest(23, 59, 59, 23, 59, 59)).to.exist
            expect(createTest(0, 0, 0, 23, 59, 59).score).to.equal(86399)
        })

        it('handles noon-rollover boundaries', () => {
            // exit 12 + 12 = 24 is out of range
            expect(createTest(12, 30, 0, 12, 5, 0)).to.not.exist
            // exit 11 + 12 = 23 is the last valid shift
            expect(createTest(23, 0, 0, 11, 59, 59)?.score).to.equal(3599)
            // rollover landing exactly on enter
            expect(createTest(12, 0, 0, 0, 0, 0)?.score).to.equal(0)
        })

        it('computes a score in seconds', () => {
            expect(createTest(0,  0, 0, 0,  0, 1).score).to.equal(1)
            expect(createTest(0, 20, 0, 0, 30, 0).score).to.equal(600)
            expect(scoreTest(0,  0, 0, 0,  0, 1).scoreAsTime).to.equal('00:00:01')
            expect(scoreTest(0, 20, 0, 0, 30, 0).scoreAsTime).to.equal('00:10:00')
            expect(scoreTest(0, 20, 0, 2, 30, 0).scoreAsTime).to.equal('02:10:00')
            expect(scoreTest(14, 21, 40, 14, 24, 28).scoreAsTime).to.equal('00:02:48')
            expect(scoreTest(0, 0, 0, 23, 59, 59).scoreAsTime).to.equal('23:59:59')
        })

        it('allows enter and exit to be equal (zero score)', () => {
            expect(createTest(5, 0, 0, 5, 0, 0).score).to.equal(0)
        })

        it('rejects NaN components independent of range checks', () => {
            expect(createTest(0, 0, 0, 0, NaN as any as number, 0)).to.not.exist
            expect(createTest(NaN as any as number, 0, 0, 1, 0, 0)).to.not.exist
        })
    })

    it('returns NaN total if any test is NaN', () => {
        const enduro: SprintEnduro = new SprintEnduro()
        enduro.tests.push(createTest(0, 0, 0, 0, 0, 1))
        enduro.tests.push(new SprintTest(new SprintTestTime(NaN, 0, 0), new SprintTestTime()))
        expect(enduro.score).toBeNaN()
    })

    describe('scoreAsTimeData', () => {
        it('returns NaN components for an empty enduro', () => {
            expect(new SprintEnduro().scoreAsTimeData).to.deep.equal({ hour: NaN, minute: NaN, second: NaN })
        })

        it('splits the total into hour/minute/second', () => {
            const enduro = new SprintEnduro()
            enduro.tests.push(createTest(0, 0, 0, 0, 0, 1))
            expect(enduro.scoreAsTimeData).to.deep.equal({ hour: 0, minute: 0, second: 1 })
            enduro.tests.push(createTest(0, 0, 0, 2, 45, 2))
            expect(enduro.scoreAsTimeData).to.deep.equal({ hour: 2, minute: 45, second: 3 })
        })

        it('does not wrap totals of 24 hours or more', () => {
            const enduro = new SprintEnduro()
            enduro.tests.push(createTest(0, 0, 0, 23, 59, 59))
            enduro.tests.push(createTest(0, 0, 0, 1, 0, 1))
            expect(enduro.scoreAsTimeData).to.deep.equal({ hour: 25, minute: 0, second: 0 })
        })
    })

    describe('scoreString', () => {
        it('does not wrap at 24 hours', () => {
            expect(scoreString(90000)).to.equal('25:00:00')
        })

        // Documents current (unformatted) behavior for out-of-domain input
        it('passes negative and fractional values through', () => {
            expect(scoreString(-1)).to.equal('-1:-1:-1')
            expect(scoreString(1.5)).to.equal('00:00:1.5')
        })
    })

    it('computes a total score', () => {
        const enduro: SprintEnduro = new SprintEnduro()
        enduro.tests.push(createTest(0, 0, 0, 0, 0, 1))
        expect(enduro.score).to.equal(1)
        expect(scoreString(enduro.score)).to.equal('00:00:01')
        enduro.tests.push(createTest(0, 10, 0, 0, 15, 0))
        expect(enduro.score).to.equal(5*60 + 1)
        expect(scoreString(enduro.score)).to.equal('00:05:01')
    })

    it('scores the steam donkey card the same in 24 hour and am/pm time', () => {
        const twentyFourHour: SprintEnduro = new SprintEnduro()
        twentyFourHour.tests.push(createTest( 9, 18,  0,  9, 47, 19))
        twentyFourHour.tests.push(createTest( 9, 56, 20, 10,  3, 32))
        twentyFourHour.tests.push(createTest(10, 32, 40, 11, 20,  1))
        twentyFourHour.tests.push(createTest(12, 28, 20, 12, 53,  9))
        twentyFourHour.tests.push(createTest(12, 59, 40, 13,  6, 10))
        twentyFourHour.tests.push(createTest(13, 22,  0, 14,  9,  4))
        twentyFourHour.tests.push(createTest(14, 21, 40, 14, 24, 28))
        expect(scoreString(twentyFourHour.score)).to.equal('02:45:03')

        const amPm: SprintEnduro = new SprintEnduro()
        amPm.tests.push(createTest( 9, 18,  0,  9, 47, 19))
        amPm.tests.push(createTest( 9, 56, 20, 10,  3, 32))
        amPm.tests.push(createTest(10, 32, 40, 11, 20,  1))
        amPm.tests.push(createTest(12, 28, 20, 12, 53,  9))
        amPm.tests.push(createTest(12, 59, 40,  1,  6, 10))
        amPm.tests.push(createTest( 1, 22,  0,  2,  9,  4))
        amPm.tests.push(createTest( 2, 21, 40,  2, 24, 28))
        expect(scoreString(amPm.score)).to.equal('02:45:03')
    })

    it('does not mutate the caller-supplied enter/exit objects', () => {
        const enter = { hour: 12, minute: 0, second: 0 }
        const exit = { hour: 1, minute: 0, second: 0 }
        const enterBefore = { ...enter }
        const before = { ...exit }

        const result = SprintTest.fromTimes(enter, exit) as SprintTest

        expect(enter).to.deep.equal(enterBefore)
        expect(exit).to.deep.equal(before)
        expect(result.enter).to.not.equal(enter)
        expect(result.exit).to.not.equal(exit)
        expect(result.exit.hour).to.equal(13)
    })
})