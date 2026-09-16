import raceData from '../fixtures/2026-little-rhody-brandx.json' with { type: 'json' };
import { expect } from "chai"
import { TimeKeeperEnduro, Secret, Known, Emergency } from '../../src/timekeeper'
import { ScoreFormat } from '../../src/timekeeper.scoring.base'

class BrandXEnduro extends TimeKeeperEnduro {
    constructor(riderMinute: number) {
        super(riderMinute, ScoreFormat.NETRA_BrandX)
    }
}

describe('BrandX Little Rhody Scores', async () => {
    expect(raceData.timeCards[0]!.checkTimes.length).to.equal(raceData.checkTypes.length)

    raceData.timeCards.forEach((timeCard, index: number) => {
        it(`Little Rhody Time Card ${index + 1}`, () => {
            const enduro: BrandXEnduro = new BrandXEnduro(timeCard.startMinute)

            for (let checkIx = 0; checkIx < raceData.checkTypes.length; checkIx++) {
                const minute = timeCard.checkTimes[checkIx]![0] as number
                const second = timeCard.checkTimes[checkIx]![1] as number

                switch (raceData.checkTypes[checkIx]) {
                    case "K":
                        enduro.checkpoints.push(new Known(minute))
                        break
                    case "S":
                        enduro.checkpoints.push(new Secret(minute))
                        break
                    case "E":
                        enduro.checkpoints.push(new Emergency(minute, second))
                        break
                    default:
                        throw new Error(`Unknown checkpoint type: ${raceData.checkTypes[checkIx]}`)
                }
            }
            const score = enduro.score

            for (let checkIx = 0; checkIx < raceData.checkTypes.length; checkIx++) {
                const expected = timeCard.checkScores[checkIx]
                expect(score.checkScores[checkIx]?.points).to.equal(expected![0])
                expect(score.checkScores[checkIx]?.emergencyPoints).to.equal(expected![1])
            }

            expect(score.points).to.equal(timeCard.points)
            expect(score.emergencyPoints).to.equal(timeCard.epoints)
            expect(score.disqualified).to.be.false
        })
    })
})