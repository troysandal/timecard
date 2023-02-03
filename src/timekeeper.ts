// From https://ecea.org/ecea/enduro-time-keeping/

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

    points(riderMinute: number) : number
    disqualified(riderMinute: number): boolean
}

/**
 * Start Control 
 * 
 * A known starting checkpoint for an enduro or a section of an enduro. 
 * Marked by a yellow flag with letters ST in black.  Riders’ times are 
 * recorded.  No penalty points are accrued for being early, but points are 
 * awarded for being late.  Riders leave a start control on the minute 
 * corresponding to their number.
*/
export class Start implements Checkpoint {
    type = CheckpointTypes.Start
    minute = 0
    seconds = 0

    constructor(minute: number) {
        this.minute = minute
    }

    points(riderMinute: number): number {
        let score = 0

        if (this.minute >= riderMinute) {
            // Only late points is 1pt/min
            score = this.minute - riderMinute
        } 
        return score
    }

    disqualified(riderMinute: number): boolean {
        return false
    }
}

/**
 * Known Control
 *
 * A known checkpoint on the enduro course, usually at a gas stop, or at the 
 * finish.  Marked by a yellow flag with the letter K in black.  There is no 
 * penalty for being up to 15 minutes early, but late points are accumulated.  
 * Arriving more than 15 minutes early results in disqualification.
*/
export class Known extends Start {
    type = CheckpointTypes.Known

    constructor(minute: number) {
        super(minute)
    }

    disqualified(riderMinute: number): boolean {
        return (riderMinute - this.minute) > 15
    }
}

/**
 * Secret Check
 * 
 * An unknown checkpoint location on the course.  Marked by a half red, half
 * white flag with the letters ST in black.  Riders are penalized for being 
 * early (2pts 1st minute, 5pts/min after) or late (1pt/min).
*/
export class Secret implements Checkpoint {
    type = CheckpointTypes.Secret
    minute = 0
    seconds = 0

    constructor(minute: number) {
        this.minute = minute
    }

    points(riderMinute: number): number {
        let score = 0

        if (this.minute >= riderMinute) {
            score = this.minute - riderMinute
        } else {
            score = 5 * (riderMinute - this.minute) - 3
        }
        return score
    }

    disqualified(riderMinute: number): boolean {
        return false
    }
}

/**
 * Emergency Check
 * 
 * An unknown checkpoint location on the course. Riders’ times are recorded to
 * the second.  Optimum time to arrive is 30 seconds into the riders’ minute.  
 * For example, if you are riding on minute 5, you want to arrive at the 
 * checkpoint at 5 minutes 30 seconds.  Penalty seconds are calculated from 
 * the 30-second mark of your assigned minute.  If you are on minute 5 and 
 * arrive at 7:09 you receive 99 penalty seconds.  If you arrive at 5:25, you 
 * receive 5 penalty seconds.  Early and late minutes are also accumulated.  
 * The seconds are used to break ties between riders with the same number of 
 * accumulated points at the end of the day.  Emergency checks are marked by 
 * a half green, half white flag with a black letter E.  All ECEA enduros have 
 * at least 2 emergency checks.
*/
export class Emergency extends Secret {
    type = CheckpointTypes.Emergency

    constructor(minute: number, seconds: number) {
        super(minute)
        this.seconds = seconds
    }

    emergencyPoints(riderMinute: number): number {
        if (this.minute == riderMinute) {
            return Math.abs(this.seconds - 30)
        } else if (this.minute > riderMinute) {
            return 30 + this.seconds + 60 * (this.minute - riderMinute - 1)
        } else {
            return 30 + (60 - this.seconds) + 60 * (riderMinute - this.minute - 1)
        }
    }
}

/**
 * Encapsulates an time keeper enduro score card, computing the total
 * points as well as emergency points.
 */
export class TimeKeeperEnduro {
    riderMinute: number = 1
    checkpoints: Array<Checkpoint> = []

    constructor(riderMinute: number) {
        console.assert(riderMinute >= 1)
        this.riderMinute = riderMinute
    }
    
    get points(): number {
        return this.checkpoints
            .map((checkpoint) => checkpoint.points(this.riderMinute))
            .reduce((prev, points) => (prev + points), 0)
    }

    get emergencyPoints(): number {
        return this.checkpoints
            .map((checkpoint) => {
                if (checkpoint instanceof Emergency) {
                    return (checkpoint as Emergency).emergencyPoints(this.riderMinute)
                }
                return 0
            })
            .reduce((prev, cur) => (prev + cur), 0)
    }

    get disqualified(): boolean {
        return this.checkpoints.some((checkpoint => checkpoint.disqualified(this.riderMinute)))
    }
}