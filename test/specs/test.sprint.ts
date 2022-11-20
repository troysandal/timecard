import { expect } from "chai"
import { SprintEnduro, SprintTest } from '../../src/sprint'

describe('Sprint Enduro', () => {
    function createTest(enterTime: string, exitTime: string): SprintTest {
        const result = SprintTest.fromTimes(enterTime, exitTime) as SprintTest
        return result
    }

    it('detects invalie time strings', () => {
        expect(SprintTest.fromTimes(undefined as unknown as string, undefined as unknown as string)).to.not.exist
        expect(SprintTest.fromTimes('', '')).to.not.exist
        expect(SprintTest.fromTimes('00:10:', '00:10:')).to.not.exist
        expect(SprintTest.fromTimes(' ', '\t')).to.not.exist
        expect(SprintTest.fromTimes('x', '-1:-1:-1')).to.not.exist
        expect(SprintTest.fromTimes('00:00:00', '24:00:01')).to.not.exist
    })

    it('ensures exit time is after enter', () => {
        expect(SprintTest.fromTimes('00:20:00', '00:00:00')).to.not.exist
        expect(SprintTest.fromTimes('00:00:00', '00:00:01')).to.exist
    })

    it('computes a score in seconds', () => {
        expect(createTest('00:00:00', '00:00:01').score).to.equal(1)
        expect(createTest('00:20:00', '00:30:00').score).to.equal(600)

        expect(createTest('00:00:00', '00:0:01').scoreString).to.equal('00:00:01')
        expect(createTest('00:20:00', '00:30:00').scoreString).to.equal('00:10:00')
        expect(createTest('00:20:00', '02:30:00').scoreString).to.equal('02:10:00')
    })

    it('will requires all time components', () => {
        expect(createTest('00', '01')).to.not.exist
        expect(createTest('00:00', '00:01')).to.not.exist
    })

    it('computes a total score', () => {
        const enduro: SprintEnduro = new SprintEnduro()
        enduro.tests.push(createTest('00:00:00', '00:00:01'))
        expect(enduro.score).to.equal(1)
        expect(enduro.scoreString).to.equal('00:00:01')
        enduro.tests.push(createTest('00:10:00', '00:15:00'))
        expect(enduro.score).to.equal(5*60 + 1)
        expect(enduro.scoreString).to.equal('00:05:01')
    })

    it('hanldes empty time cards', () => {
        const enduro: SprintEnduro = new SprintEnduro()
        expect(enduro.score).to.equal(0)
        expect(enduro.scoreString).to.equal('00:00:00')
    })

    it('can handle the steam donkey', () => {
        const enduro: SprintEnduro = new SprintEnduro()

        enduro.tests.push(createTest('09:18:00', '09:47:19'))
        enduro.tests.push(createTest('09:56:20', '10:03:32'))
        enduro.tests.push(createTest('10:32:40', '11:20:01'))
        enduro.tests.push(createTest('12:28:20', '12:53:09'))
        enduro.tests.push(createTest('12:59:40', '13:06:10'))
        enduro.tests.push(createTest('13:22:00', '14:09:04'))
        enduro.tests.push(createTest('14:21:40', '14:24:28'))

        expect(enduro.scoreString).to.equal('02:45:03')
    })
})