import { expect } from "chai"
import { TimeKeeperEnduro, Start, Secret, Known, Emergency, CheckpointTypes } from '../../src/timekeeper'
import { ScoreFormat } from '../../src/timekeeper.scoring.base'

class BrandXEnduro extends TimeKeeperEnduro {
    constructor(riderMinute: number) {
        super(riderMinute, ScoreFormat.NETRA_BrandX)
    }
}

describe('BrandX Time Keeper Enduros', async () => {
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

    it('Handles Empty Enduros', () => {
        const enduro: BrandXEnduro = new BrandXEnduro(17)
        expect(enduro.points).to.equal(0)
        expect(enduro.emergencyPoints).to.equal(0)
    })

    it('Detects invalid scores', () => {
        const enduro = new BrandXEnduro(17)
        enduro.checkpoints.push(new Secret(NaN))
        const score = enduro.score
        expect(score.points).to.equal(0)
        expect(score.checkScores[0]?.invalid).to.be.true
    })

    it('Does not include dropped or invalid checks', () => {
        const enduro = new BrandXEnduro(17)
        enduro.checkpoints.push(new Secret(NaN))
        enduro.checkpoints.push(new Secret(18, true))
        enduro.checkpoints.push(new Secret(7))
        
        const score = enduro.score
        expect(score.points).to.equal(47)
        expect(score.checkScores[0]?.invalid).to.be.true
        expect(score.nonDroppedChecks).to.equal(1)
    })

    it("can drop a checkpoint", () => {
        const enduro = new BrandXEnduro(17)
        enduro.checkpoints = [
            new Secret(16),
            new Secret(17)
        ]
        expect(enduro.checkpoints.length).to.equal(2)
        expect(enduro.points).to.equal(3)

        enduro.checkpoints[0]!.drop = true

        const score = enduro.score
        expect(score.points).to.equal(0)
        expect(score.checkScores.length).to.equal(2)
        expect(score.nonDroppedChecks).to.equal(1)
        expect(score.disqualified).to.be.false
    })

    describe('Start Controls', () => {
        it('Has correct type', () => {
            expect(new Start(0).type).to.equal(CheckpointTypes.Start)
        })

        it("Zero'ing", () => {
            const enduro: BrandXEnduro = new BrandXEnduro(17)
            enduro.checkpoints = [
                new Start(17),
                new Start(17)
            ]
            expect(enduro.points).to.equal(0)
            expect(enduro.emergencyPoints).to.equal(0)
        })

        it('Computes Late Points @ 1pt/min', () => {
            const enduro: BrandXEnduro = new BrandXEnduro(17)
            enduro.checkpoints = [
                new Start(20),
                new Start(18)
            ]
            expect(enduro.points).to.equal(3)
            expect(enduro.emergencyPoints).to.equal(0)
        })
    
        it('Computes Early Points', () => {
            const enduro: BrandXEnduro = new BrandXEnduro(17)
            enduro.checkpoints = [
                new Start(16),
                new Start(15)
            ]
            expect(enduro.points).to.equal(0)
            expect(enduro.emergencyPoints).to.equal(0)
        })

        it('Does not count when dropped', () => {
            const enduro: BrandXEnduro = new BrandXEnduro(17)
            enduro.checkpoints = [
                new Start(18),  // 2 points
            ]
            expect(enduro.points).to.equal(1)
            expect(enduro.emergencyPoints).to.equal(0)
            enduro.checkpoints[0]!.drop = true
            expect(enduro.points).to.equal(0)
            expect(enduro.emergencyPoints).to.equal(0)
        })
    })

    describe('Known Controls', () => {
        it('Has correct type', () => {
            expect(new Known(0).type).to.equal(CheckpointTypes.Known)
        })

        it("Zero'ing", () => {
            const enduro: BrandXEnduro = new BrandXEnduro(17)
            enduro.checkpoints = [
                new Known(17),
                new Known(17)
            ]
            expect(enduro.points).to.equal(0)
            expect(enduro.emergencyPoints).to.equal(0)
        })

        it('Computes Late Points @ 1pt/min', () => {
            const enduro: BrandXEnduro = new BrandXEnduro(17)
            enduro.checkpoints = [
                new Known(20),
                new Known(18)
            ]
            expect(enduro.points).to.equal(3)
            expect(enduro.emergencyPoints).to.equal(0)
        })
    
        it('Computes Early Points', () => {
            const enduro: BrandXEnduro = new BrandXEnduro(17)
            enduro.checkpoints = [
                new Known(16),
                new Known(15)
            ]
            expect(enduro.points).to.equal(4)
            expect(enduro.emergencyPoints).to.equal(0)
        })

        it ('Can disqualify if > 5 minutes early', () => {
            const enduro: BrandXEnduro = new BrandXEnduro(30)
            enduro.checkpoints = [ new Known(25) ]
            expect(enduro.points).to.equal(22)
            expect(enduro.disqualified).to.be.false
            expect(enduro.emergencyPoints).to.equal(0)

            enduro.checkpoints = [ new Known(24) ]
            expect(enduro.points).to.equal(27)
            expect(enduro.disqualified).to.be.false
            expect(enduro.emergencyPoints).to.equal(0)
        })

        it('Does not count when dropped', () => {
            const enduro: BrandXEnduro = new BrandXEnduro(17)
            enduro.checkpoints = [
                new Known(18)
            ]
            expect(enduro.points).to.equal(1)
            expect(enduro.emergencyPoints).to.equal(0)
            enduro.checkpoints[0]!.drop = true
            expect(enduro.points).to.equal(0)
            expect(enduro.emergencyPoints).to.equal(0)
        })
    })

    describe('Secret Controls', () => {
        it('Has correct type', () => {
            expect(new Secret(0).type).to.equal(CheckpointTypes.Secret)
        })

        it("Zero'ing", () => {
            const enduro: BrandXEnduro = new BrandXEnduro(17)
            enduro.checkpoints = [
                new Secret(17),
                new Secret(17)
            ]
            expect(enduro.points).to.equal(0)
            expect(enduro.emergencyPoints).to.equal(0)
        })

        it('Computes Late Points @ 1pt/min', () => {
            const enduro: BrandXEnduro = new BrandXEnduro(17)
            enduro.checkpoints = [
                new Secret(20),
                new Secret(18)
            ]
            expect(enduro.points).to.equal(10)
            expect(enduro.emergencyPoints).to.equal(0)
        })
    
        it('Computes Early Points', () => {
            const enduro: BrandXEnduro = new BrandXEnduro(17)
            enduro.checkpoints = [
                new Secret(16),  // 2 points
                new Secret(15)   // 2 points
            ]
            expect(enduro.points).to.equal(4)
            expect(enduro.emergencyPoints).to.equal(0)
        })

        it('Does not count when dropped', () => {
            const enduro: BrandXEnduro = new BrandXEnduro(17)
            enduro.checkpoints = [
                new Secret(18)
            ]
            expect(enduro.points).to.equal(1)
            expect(enduro.emergencyPoints).to.equal(0)
            enduro.checkpoints[0]!.drop = true
            expect(enduro.points).to.equal(0)
            expect(enduro.emergencyPoints).to.equal(0)
        })

        it('Rule B.2 - DQ at > 5 min early', () => {
            const enduro: BrandXEnduro = new BrandXEnduro(17)
            enduro.checkpoints = [
                new Secret(11)
            ]
            expect(enduro.points).to.equal(27)
            expect(enduro.disqualified).to.be.true
        })
    })

    describe('Emergency Controls', () => {
        it('Has correct type', () => {
            expect(new Emergency(0, 0).type).to.equal(CheckpointTypes.Emergency)
        })

        it('Supports Rider Minutes > 59', () => {
            const enduro: BrandXEnduro = new BrandXEnduro(60)
            const check = new Emergency(60, 30)
            enduro.checkpoints.push(check)
            expect(enduro.emergencyPoints).to.equal(0)
        })

        it("Zero'ing", () => {
            const enduro: BrandXEnduro = new BrandXEnduro(17)
            enduro.checkpoints = [
                new Emergency(17, 30),
                new Emergency(17, 30)
            ]
            expect(enduro.points).to.equal(0)
            expect(enduro.emergencyPoints).to.equal(0)
        })

        it('Computes Late Points @ 1pt/min', () => {
            let enduro: BrandXEnduro = new BrandXEnduro(17)
            enduro.checkpoints = [
                new Emergency(18, 23)
            ]
            expect(enduro.points).to.equal(1)
            expect(enduro.emergencyPoints).to.equal(53)

            enduro = new BrandXEnduro(5)
            enduro.checkpoints = [
                new Emergency(7, 9)
            ]
            expect(enduro.points).to.equal(2)
            expect(enduro.emergencyPoints).to.equal(99)
        })
    
        it('Computes Early Points', () => {
            let enduro: BrandXEnduro = new BrandXEnduro(17)
            enduro.checkpoints = [
                new Emergency(16, 30)
            ]
            expect(enduro.points).to.equal(2)
            expect(enduro.emergencyPoints).to.equal(60)

            enduro = new BrandXEnduro(5)
            enduro.checkpoints = [
                new Emergency(5, 25)
            ]
            expect(enduro.points).to.equal(0)
            expect(enduro.emergencyPoints).to.equal(5)
        })

        it('Does not count when dropped', () => {
            const enduro: BrandXEnduro = new BrandXEnduro(17)
            enduro.checkpoints = [
                new Emergency(16, 30)
            ]
            expect(enduro.points).to.equal(2)
            expect(enduro.emergencyPoints).to.equal(60)

            enduro.checkpoints[0]!.drop = true
            expect(enduro.points).to.equal(0)
            expect(enduro.emergencyPoints).to.equal(0)
        })
    })

    describe('Knowns (Merge)', () => {
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
})