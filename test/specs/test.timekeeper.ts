import { expect } from "chai"
import { TimeKeeperEnduro, Secret, Start, Known, Emergency, CheckpointTypes } from '../../src/timekeeper'

describe('Time Keeper Enduro', () => {
    it('Handles Empty Enduros', () => {
        const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
        expect(enduro.points).to.equal(0)
        expect(enduro.emergencyPoints).to.equal(0)
    })

    it('Handles Full Enduros', () => {
        const enduro = new TimeKeeperEnduro(17)
        enduro.checkpoints = [
            new Secret(16),
            new Secret(17),
            new Emergency(17, 30),
            new Secret(17),
            new Secret(17),
            new Secret(17),
            new Emergency(18, 23),
            new Secret(17),
            new Secret(17),
            new Emergency(26, 3),
            new Secret(17),
            new Emergency(21, 40),
            new Known(17)
        ]
        expect(enduro.checkpoints.length).to.equal(13)
        expect(enduro.points).to.equal(16)
        expect(enduro.emergencyPoints).to.equal(816)
    })

    describe('Start Controls', () => {
        it('Has correct type', () => {
            expect(new Start(0).type).to.equal(CheckpointTypes.Start)
        })

        it("Zero'ing", () => {
            const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
            enduro.checkpoints = [
                new Start(17),
                new Start(17)
            ]
            expect(enduro.points).to.equal(0)
            expect(enduro.emergencyPoints).to.equal(0)
        })

        it('Computes Late Points @ 1pt/min', () => {
            const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
            enduro.checkpoints = [
                new Start(20),
                new Start(18)
            ]
            expect(enduro.points).to.equal(4)
            expect(enduro.emergencyPoints).to.equal(0)
        })
    
        it('Computes Early Points', () => {
            const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
            enduro.checkpoints = [
                new Start(16),  // 2 points
                new Start(15)   // 2 + 5 == 7 points
            ]
            expect(enduro.points).to.equal(0)
            expect(enduro.emergencyPoints).to.equal(0)
        })
    })

    describe('Known Controls', () => {
        it('Has correct type', () => {
            expect(new Known(0).type).to.equal(CheckpointTypes.Known)
        })

        it("Zero'ing", () => {
            const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
            enduro.checkpoints = [
                new Known(17),
                new Known(17)
            ]
            expect(enduro.points).to.equal(0)
            expect(enduro.emergencyPoints).to.equal(0)
        })

        it('Computes Late Points @ 1pt/min', () => {
            const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
            enduro.checkpoints = [
                new Known(20),
                new Known(18)
            ]
            expect(enduro.points).to.equal(4)
            expect(enduro.emergencyPoints).to.equal(0)
        })
    
        it('Computes Early Points', () => {
            const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
            enduro.checkpoints = [
                new Known(16),  // 2 points
                new Known(15)   // 2 + 5 == 7 points
            ]
            expect(enduro.points).to.equal(0)
            expect(enduro.emergencyPoints).to.equal(0)
        })

        it ('Can disqualify if > 15 minutes early', () => {
            const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(30)
            enduro.checkpoints = [ new Known(15) ]
            expect(enduro.points).to.equal(0)
            expect(enduro.disqualified).to.be.false
            expect(enduro.emergencyPoints).to.equal(0)

            enduro.checkpoints = [ new Known(14) ]
            expect(enduro.points).to.equal(0)
            expect(enduro.disqualified).to.be.true
            expect(enduro.emergencyPoints).to.equal(0)
        })
    })

    describe('Secret Controls', () => {
        it('Has correct type', () => {
            expect(new Secret(0).type).to.equal(CheckpointTypes.Secret)
        })

        it("Zero'ing", () => {
            const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
            enduro.checkpoints = [
                new Secret(17),
                new Secret(17)
            ]
            expect(enduro.points).to.equal(0)
            expect(enduro.emergencyPoints).to.equal(0)
        })

        it('Computes Late Points @ 1pt/min', () => {
            const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
            enduro.checkpoints = [
                new Secret(20),
                new Secret(18)
            ]
            expect(enduro.points).to.equal(4)
            expect(enduro.emergencyPoints).to.equal(0)
        })
    
        it('Computes Early Points', () => {
            const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
            enduro.checkpoints = [
                new Secret(16),  // 2 points
                new Secret(15)   // 2 + 5 == 7 points
            ]
            expect(enduro.points).to.equal(9)
            expect(enduro.emergencyPoints).to.equal(0)
        })
    })

    describe('Emergency Controls', () => {
        it('Has correct type', () => {
            expect(new Emergency(0, 0).type).to.equal(CheckpointTypes.Emergency)
        })

        it("Zero'ing", () => {
            const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
            enduro.checkpoints = [
                new Emergency(17, 30),
                new Emergency(17, 30)
            ]
            expect(enduro.points).to.equal(0)
            expect(enduro.emergencyPoints).to.equal(0)
        })

        it('Computes Late Points @ 1pt/min', () => {
            let enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
            enduro.checkpoints = [
                new Emergency(18, 23)
            ]
            expect(enduro.points).to.equal(1)
            expect(enduro.emergencyPoints).to.equal(53)

            enduro = new TimeKeeperEnduro(5)
            enduro.checkpoints = [
                new Emergency(7, 9)
            ]
            expect(enduro.points).to.equal(2)
            expect(enduro.emergencyPoints).to.equal(99)
        })
    
        it('Computes Early Points', () => {
            let enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
            enduro.checkpoints = [
                new Emergency(16, 30)
            ]
            expect(enduro.points).to.equal(2)
            expect(enduro.emergencyPoints).to.equal(60)

            enduro = new TimeKeeperEnduro(5)
            enduro.checkpoints = [
                new Emergency(5, 25)
            ]
            expect(enduro.points).to.equal(0)
            expect(enduro.emergencyPoints).to.equal(5)
        })
    })
})