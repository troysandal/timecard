import { expect } from "chai"
import { SprintEnduro, SprintTest } from '../../src/sprint'

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

    it('hanldes empty time cards', () => {
        const enduro: SprintEnduro = new SprintEnduro()
        expect(enduro.score).to.equal(0)
        expect(enduro.scoreString).to.equal('00:00:00')
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

        expect(createTest(0, 0, 60, 0, 0, '' as any as number)).to.not.exist
    })

    it('ensures exit time is after enter', () => {
        expect(createTest(0,0,0,0,0,1)).to.exist
        // am/pm support, e.g. 12pm, 1pm is ok
        expect(createTest(12, 0, 0, 1, 30, 0)).to.exist
        expect(createTest(22, 0, 0, 21, 30, 0)).to.not.exist
    })

    it('computes a score in seconds', () => {
        expect(createTest(0,  0, 0, 0,  0, 1).score).to.equal(1)
        expect(createTest(0, 20, 0, 0, 30, 0).score).to.equal(600)
        expect(createTest(0,  0, 0, 0,  0, 1).scoreString).to.equal('00:00:01')
        expect(createTest(0, 20, 0, 0, 30, 0).scoreString).to.equal('00:10:00')
        expect(createTest(0, 20, 0, 2, 30, 0).scoreString).to.equal('02:10:00')
    })

    it('computes a total score', () => {
        const enduro: SprintEnduro = new SprintEnduro()
        enduro.tests.push(createTest(0, 0, 0, 0, 0, 1))
        expect(enduro.score).to.equal(1)
        expect(enduro.scoreString).to.equal('00:00:01')
        enduro.tests.push(createTest(0, 10, 0, 0, 15, 0))
        expect(enduro.score).to.equal(5*60 + 1)
        expect(enduro.scoreString).to.equal('00:05:01')
    })

    it('can handle the steam donkey 24 hour time', () => {
        const enduro: SprintEnduro = new SprintEnduro()

        enduro.tests.push(createTest( 9, 18,  0,  9, 47, 19))
        enduro.tests.push(createTest( 9, 56, 20, 10,  3, 32))
        enduro.tests.push(createTest(10, 32, 40, 11, 20,  1))
        enduro.tests.push(createTest(12, 28, 20, 12, 53,  9))
        enduro.tests.push(createTest(12, 59, 40, 13,  6, 10))
        enduro.tests.push(createTest(13, 22,  0, 14,  9,  4))
        enduro.tests.push(createTest(14, 21, 40, 14, 24, 28))

        expect(enduro.scoreString).to.equal('02:45:03')
    })

    it('can handle the steam donkey am/pm time', () => {
        const enduro: SprintEnduro = new SprintEnduro()

        enduro.tests.push(createTest( 9, 18,  0,  9, 47, 19))
        enduro.tests.push(createTest( 9, 56, 20, 10,  3, 32))
        enduro.tests.push(createTest(10, 32, 40, 11, 20,  1))
        enduro.tests.push(createTest(12, 28, 20, 12, 53,  9))
        enduro.tests.push(createTest(12, 59, 40, 1,  6, 10))
        enduro.tests.push(createTest(1, 22,  0, 2,  9,  4))
        enduro.tests.push(createTest(2, 21, 40, 2, 24, 28))

        expect(enduro.scoreString).to.equal('02:45:03')
    })
})