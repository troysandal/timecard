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

export interface Checkpoint {
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

export enum ScoreFormat {
    AMA_National = "AMA",
    NETRA_BrandX = "BrandX"
}

/**
 * Encapsulates an time keeper enduro score card, computing the points
 * emergency points, disqualified, etc.
 */
export class TimeKeeperEnduro {
    riderMinute: number = 1
    checkpoints: Array<Checkpoint> = []
    format: ScoreFormat = ScoreFormat.AMA_National

    constructor(riderMinute: number, format: ScoreFormat = ScoreFormat.AMA_National) {
        console.assert(riderMinute >= 1)
        this.riderMinute = riderMinute
        this.format = format
    }
}

export function areEqual(l: TimeKeeperEnduro, r: TimeKeeperEnduro): boolean {
    function checkEqual(c1: Checkpoint, c2: Checkpoint): boolean {
        return c1.type === c2.type &&
               c1.minute === c2.minute &&
               c1.seconds === c2.seconds &&
               c1.drop === c2.drop
    }
    return l.riderMinute === r.riderMinute &&
           l.format === r.format &&
           l.checkpoints.length === r.checkpoints.length &&
           l.checkpoints.every((c, i) => checkEqual(c, r.checkpoints[i]!))
}
