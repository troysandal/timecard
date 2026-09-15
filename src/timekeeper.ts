/**
 * timekeeper.ts - Time Keeping Enduro Data Model
 * 
 * Contains the data structures to represent a time keeping enduro race.  Races
 * contain a collection of checkpoint times from which a score is computed.
 */


/******************************* Checkpoints *******************************/

export enum CheckpointTypes {
    Start,
    Known,
    Secret,
    Emergency
}

export type Checkpoint = {
    type: CheckpointTypes
    minute: number
    seconds: number
    drop: boolean
}

class CheckpointBase implements Checkpoint {
    type = CheckpointTypes.Start
    minute = 1
    seconds = 0
    drop = false

    constructor(type: CheckpointTypes, minute: number, seconds: number = 0, drop:boolean = false) {
        this.type = type
        this.minute = minute
        this.seconds = seconds
        this.drop = drop
    }
}

export class Start extends CheckpointBase {
    constructor(minute: number, drop: boolean = false) {
        super(CheckpointTypes.Start, minute, 0, drop)
    }
}

export class Known extends CheckpointBase {
    constructor(minute: number, drop: boolean = false) {
        super(CheckpointTypes.Known, minute, 0, drop)
    }
}

export class Secret extends CheckpointBase {
    constructor(minute: number, drop: boolean = false) {
        super(CheckpointTypes.Secret, minute, 0, drop)
    }
}

export class Emergency extends CheckpointBase {
    constructor(minute: number, seconds: number, drop: boolean = false) {
        super(CheckpointTypes.Emergency, minute, seconds, drop)
    }
}


/******************************** EnduroRace *******************************/

import { ScoreFormat, ScoreKeeper, type ScoreCard } from "./timekeeper.scoring"

/**
 * Encapsulates an time keeper enduro score card, computing the points
 * emergency points, disqualified, etc.
 */
export class TimeKeeperEnduro {
    riderMinute: number = 1
    checkpoints: Array<Checkpoint> = []
    format: ScoreFormat = ScoreFormat.AMANational

    constructor(riderMinute: number, format: ScoreFormat = ScoreFormat.AMANational) {
        console.assert(riderMinute >= 1)
        this.riderMinute = riderMinute
        this.format = format
    }

    get score(): ScoreCard {
        const scoreKeeper: ScoreKeeper = new ScoreKeeper(this.format)
        return scoreKeeper.scoreEnduro(this)
    }
    
    get points(): number {
        return this.score.points
    }

    get emergencyPoints(): number {
        return this.score.emergencyPoints
    }

    get disqualified(): boolean {
        return this.score.disqualified
    }
}
