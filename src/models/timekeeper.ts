/**
 * timekeeper.ts - Time Keeping Enduro Data Model
 * 
 * Contains the data structures to represent a time keeping enduro race.  Races
 * contain a collection of checkpoint times from which a score is computed.
 * 
 * WARNING - These classes are used to store data in the database.  If you change
 * the structure you need to add migration.
 */


/******************************* Checkpoints *******************************/

export enum CheckpointTypes {
    Start = "start",
    Known = "known",
    Secret = "secret",
    Emergency = "emergency"
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
    function equalNumber(a: number, b: number): boolean {
        return (isNaN(a) && isNaN(b)) || (a === b)
    }
    function equalCheckpoint(c1: Checkpoint, c2: Checkpoint): boolean {
        return c1.type === c2.type &&
               equalNumber(c1.minute, c2.minute) &&
               equalNumber(c1.seconds, c2.seconds) &&
               c1.drop === c2.drop
    }
    return equalNumber(l.riderMinute, r.riderMinute) &&
           l.format === r.format &&
           l.checkpoints.length === r.checkpoints.length &&
           l.checkpoints.every((c, i) => equalCheckpoint(c, r.checkpoints[i]!))
}
