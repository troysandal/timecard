import raceData from '../fixtures/2026-little-rhody-brandx.json' with { type: 'json' };
import { expect } from "chai"
import { TimeKeeperEnduro, Secret, Known, Emergency } from '../../src/timekeeper'
import { ScoreFormat } from '../../src/timekeeper.scoring'

class BrandXEnduro extends TimeKeeperEnduro {
    constructor(riderMinute: number) {
        super(riderMinute, ScoreFormat.NETRA_BrandX)
    }
}

describe('BrandX Enduros', async () => {
    it('supports changing rider minute', () => {
        const enduro: BrandXEnduro = new BrandXEnduro(3)
        
        enduro.checkpoints.push(new Secret(10))
        expect(enduro.points).to.equal(7)
        
        enduro.checkpoints.push(new Emergency(10, 19))
        expect(enduro.points).to.equal(7)
        expect(enduro.emergencyPoints).to.equal(11)

        enduro.checkpoints.push(new Secret(11))
        expect(enduro.points).to.equal(8)
        expect(enduro.disqualified).to.be.false
    })

    describe('Knowns', () => {
        it("Can enter between start and current minute", () => {
            const enduro: BrandXEnduro = new BrandXEnduro(3)

            // Start with a penalty of 7 points
            enduro.checkpoints.push(new Secret(10))

            // Come in right on last minute
            enduro.checkpoints.push(new Known(10))
            expect(enduro.score.points).to.equal(7)

            // Come in at Starting Time
            enduro.checkpoints.push(new Known(3))
            expect(enduro.score.points).to.equal(7)
        })

        it("Penalize if before start minute", () => {
            const enduro: BrandXEnduro = new BrandXEnduro(9)
            enduro.checkpoints.push(new Secret(10))
            expect(enduro.score.points).to.equal(1)

            // Come in early - before start minute
            enduro.checkpoints.push(new Known(8))
            expect(enduro.score.points).to.equal(1 + 7)
        })

        it("Penalize if after last minute (like a secret)", () => {
            const enduro: BrandXEnduro = new BrandXEnduro(9)
            enduro.checkpoints.push(new Secret(10))
            expect(enduro.score.points).to.equal(1)

            // Come in early - before start minute
            enduro.checkpoints.push(new Known(11))
            expect(enduro.score.points).to.equal(1 + 1)
        })
    })

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