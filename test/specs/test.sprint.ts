import { expect } from "chai"

// type SprintEnduro = {
//     tests: Array<SprintTest>
// }

class SprintTest {
    static fromTimes(enterTime: string, exitTime: string): SprintTest | undefined {
        const enterDate = new Date(`1970-01-01 ${enterTime}`)
        const exitDate = new Date(`1970-01-01 ${exitTime}`)

        if (isNaN(enterDate.getDate()) || isNaN(exitDate.getDate())) {
            return undefined
        }

        const result = new SprintTest()
        result.enter = enterDate
        result.exit = exitDate
        return result
    }

    get score() {
        return NaN
    }

    enter: Date
    exit: Date
};

describe('Sprint Enduro', () => {
    it('detects bad times', () => {
        const badTest = SprintTest.fromTimes('', '')
        expect(badTest).to.not.exist
    })
})