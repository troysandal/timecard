/// <reference types="mocha" />

import { expect } from "chai"
import { areEqual, TimeKeeperEnduro, Secret, Start, Known, Emergency, ScoreFormat } from '../../src/timekeeper'

describe('Time Keeper Enduro Equality Tests', () => {
    it('Empty Enduros', () => {
        const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
        const enduro2: TimeKeeperEnduro = new TimeKeeperEnduro(17)
        expect(areEqual(enduro, enduro2)).to.be.true
    })

    it('Non-Equal Rider Minute', () => {
        const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
        const enduro2: TimeKeeperEnduro = new TimeKeeperEnduro(18)
        expect(areEqual(enduro, enduro2)).to.be.false
    })

    it('Non-Equal Format', () => {
        const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
        const enduro2: TimeKeeperEnduro = new TimeKeeperEnduro(17)
        enduro2.format = ScoreFormat.NETRA_BrandX
        expect(areEqual(enduro, enduro2)).to.be.false
    })

    it('Same # of Checkpoints', () => {
        const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
        const enduro2: TimeKeeperEnduro = new TimeKeeperEnduro(17)
        enduro.checkpoints.push(new Start(1))
        enduro.checkpoints.push(new Emergency(1, 30))
        enduro2.checkpoints.push(new Known(1))
        enduro2.checkpoints.push(new Secret(1))
        expect(areEqual(enduro, enduro2)).to.be.false

        enduro.checkpoints = [new Emergency(1, 30), new Known(1)]
        enduro2.checkpoints = [new Emergency(1, 30), new Known(1)]
        expect(areEqual(enduro, enduro2)).to.be.true
    })

    it('Different # of Checkpoints', () => {
        const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
        const enduro2: TimeKeeperEnduro = new TimeKeeperEnduro(17)

        enduro.checkpoints.push(new Start(1))
        expect(areEqual(enduro, enduro2)).to.be.false

        enduro.checkpoints = []
        enduro2.checkpoints.push(new Start(1))
        expect(areEqual(enduro, enduro2)).to.be.false
    })
    it('Different # of Non-Equal Checkpoints', () => {
        const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
        const enduro2: TimeKeeperEnduro = new TimeKeeperEnduro(17)
        enduro2.checkpoints.push(new Start(1))
        expect(areEqual(enduro, enduro2)).to.be.false
    })

    it('Different Checkpoints', () => {
        const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
        const enduro2: TimeKeeperEnduro = new TimeKeeperEnduro(17)
        enduro.checkpoints.push(new Emergency(1, 30))
        enduro2.checkpoints.push(new Emergency(1, 31))
        expect(areEqual(enduro, enduro2)).to.be.false
    })
      it('Dropped Checkpoints', () => {
        const enduro: TimeKeeperEnduro = new TimeKeeperEnduro(17)
        const enduro2: TimeKeeperEnduro = new TimeKeeperEnduro(17)
        const check = new Emergency(1, 30)
        check.drop = true
        enduro.checkpoints.push(check)
        enduro2.checkpoints.push(new Emergency(1, 30))
        expect(areEqual(enduro, enduro2)).to.be.false
    })
})