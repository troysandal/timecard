/**
 * timekeeper.scoring.ts - Time Keeping Enduro Scoring
 * 
 * Contains everything you need to score both AMA and Brand X 
 * time keeping enduros.
 * 
 * Scoring Formats Supported
 * - [AMA National Format](https://ecea.org/ecea/enduro-time-keeping/)
 * - [NETRA Brand X](https://www.netra.org/wp-content/uploads/2023/03/2023-NETRA-Enduro-Rules.pdf)
 */

import type { Checkpoint } from "./timekeeper"
import { CheckpointTypes, TimeKeeperEnduro } from "./timekeeper"

interface ScoreContext {
    startingMinute: number
    currentMinute: number
}

abstract class CheckScoring {
    check: Checkpoint

    constructor(check: Checkpoint) {
        this.check = check
    }

    readonly score = (context: ScoreContext): Score => {
        let score: Score = { points: 0, emergencyPoints: 0, dropped: this.check.drop, disqualified: false, invalid: false}

        if (isNaN(this.check.minute) || isNaN(this.check.seconds)) {
            score.invalid = true
        }
        else {
            score = this.scoreImpl(context)
        }
        return score
    }

    abstract scoreImpl(context: ScoreContext): Score
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
class StartScoring extends CheckScoring {
    constructor(check: Checkpoint) {
        super(check)
    }

    scoreImpl(context: ScoreContext): Score {
        return { 
            points: this.points(context.currentMinute),
            emergencyPoints: 0,
            dropped: this.check.drop,
            disqualified: this.disqualified(context.currentMinute),
            invalid: false
        }
    }

    points(riderMinute: number): number {
        let score = 0

        if (this.check.minute >= riderMinute) {
            // Only late points is 1pt/min
            score = this.check.minute - riderMinute
        } 
        return score
    }

    disqualified(riderMinute: number): boolean {
        // @todo - AMA National hour out at 60:59 (61)
        return false
    }
}

/**
 * Secret Check
 * 
 * An unknown checkpoint location on the course.  Marked by a half red, half
 * white flag with the letters ST in black.  Riders are penalized for being 
 * early (2pts 1st minute, 5pts/min after) or late (1pt/min).
*/
class SecretScoring extends CheckScoring {
    constructor(check: Checkpoint) {
        super(check)
    }

    scoreImpl(context: ScoreContext): Score {
        return { 
            points: this.points(context.currentMinute),
            emergencyPoints: this.emergencyPoints(context.currentMinute),
            dropped: this.check.drop,
            disqualified: false,
            invalid: false
        }
    }

    points(riderMinute: number): number {
        let score = 0

        if (this.check.minute >= riderMinute) {
            score = this.check.minute - riderMinute
        } else {
            score = 5 * (riderMinute - this.check.minute) - 3
        }
        return score
    }

    emergencyPoints(riderMinute: number) : number {
        return 0
    }
}

/**
 * Known Control - AMA
 *
 * A known checkpoint on the enduro course, usually at a gas stop, or at the 
 * finish.  Marked by a yellow flag with the letter K in black.  There is no 
 * penalty for being up to 15 minutes early, but late points are accumulated.  
 * Arriving more than 15 minutes early results in disqualification.
*/
class KnownAMAScoring extends StartScoring {
    constructor(check: Checkpoint) {
        super(check)
    }

    disqualified(riderMinute: number): boolean {
        return (riderMinute - this.check.minute) > 15
    }
}


/**
 * Known Control - Brand X
 *
 * A known checkpoint on the enduro course, usually at a gas stop, or at the 
 * finish.  Marked by a yellow flag with the letter K in black. 
 *  
 * Scoring at Known Controls - Each event can have no more than four (4) Known
 * Control check points. A rider may arrive at a Known Control early without
 * penalty. A rider may check through a Known Control any time between his/her
 * original minute and the last checkpoint minute marked on his/he score card
 * without penalty. Any time recorded before the rider’s original minute or later
 * than the last minute written on said rider’s score card will result in penalty
 * points assessed. At Known Controls used at the “start” of a section and at
 * gas stop restarts, the rider’s card is marked before crossing the check flag
 * “line”. At Known Controls used as a check “out” of a section, the rider’s card
 * is marked with the time taken the moment the rider’s front wheel crosses the
 * line of scoring.
*/
class KnownBrandXScoring extends SecretScoring {
    constructor(check: Checkpoint) {
        super(check)
    }

    scoreImpl(context: ScoreContext): Score {
        return { 
            points: this.pointsBrandX(context.currentMinute, context.startingMinute),
            emergencyPoints: this.emergencyPoints(context.currentMinute),
            dropped: this.check.drop,
            disqualified: false,
            invalid: false
        }
    }

    pointsBrandX(riderMinute: number, startMinute: number): number {
        let score = 0
        
        if (this.check.minute >= riderMinute) {
            score = this.check.minute - riderMinute
        } else if (this.check.minute < startMinute) {
            score = 5 * (riderMinute - this.check.minute) - 3
        }
        return score
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
class EmergencyScoring extends SecretScoring {
    constructor(check: Checkpoint) {
        super(check)
    }

    emergencyPoints(riderMinute: number): number {
        if (this.check.minute == riderMinute) {
            return Math.abs(this.check.seconds - 30)
        } else if (this.check.minute > riderMinute) {
            return 30 + this.check.seconds + 60 * (this.check.minute - riderMinute - 1)
        } else {
            return 30 + (60 - this.check.seconds) + 60 * (riderMinute - this.check.minute - 1)
        }
    }
}

/********************************* Scoring *********************************/

export type Score = {
    points: number
    emergencyPoints: number
    dropped: boolean
    disqualified: boolean
    invalid: boolean
}

export type ScoreCard = {
    points: number
    emergencyPoints: number
    disqualified: boolean
    checkScores: Score[]
    nonDroppedChecks: number
}

export enum ScoreFormat {
    AMANational = "AMA",
    NETRA_BrandX = "BrandX"
}

export class ScoreKeeper {
    format:ScoreFormat = ScoreFormat.AMANational
    
    constructor(format:ScoreFormat) {
        this.format = format
    }

    static checkToScoring(format: ScoreFormat, check: Checkpoint): CheckScoring {
        switch (check.type) {
            case CheckpointTypes.Start:
                return new StartScoring(check)
            case CheckpointTypes.Secret:
                return new SecretScoring(check)
            case CheckpointTypes.Emergency:
                return new EmergencyScoring(check)
            case CheckpointTypes.Known:
                if (format === ScoreFormat.AMANational) {
                    return new KnownAMAScoring(check)
                } else if (format === ScoreFormat.NETRA_BrandX) {
                    return new KnownBrandXScoring(check)
                }
                throw `Unknown enduro format ${format}`
            default:
                throw `Unknown checkpoint type ${check.type}`
        }
    }
    
    scoreEnduro(enduro: TimeKeeperEnduro): ScoreCard {
        // Convert undropped checkpoints to Scoring objects by format
        const scoringChecks = enduro.checkpoints
            .map((check) => {
                return ScoreKeeper.checkToScoring(enduro.format, check)
            })
        
        // Score Individual Checkpoints
        const scoreContext: ScoreContext = {
            currentMinute: enduro.riderMinute,
            startingMinute: enduro.riderMinute
        }
        const checkScores = scoringChecks.map((scorer) => {
            const score = scorer.score(scoreContext)
            if (enduro.format === ScoreFormat.NETRA_BrandX) {
                scoreContext.currentMinute = scorer.check.minute
            }
            return score
        })

        // Add Overall Totals
        const points = checkScores
            .filter((check) => !check.dropped && !check.invalid)
            .map((check) => check.points)
            .reduce((prev, points) => (prev + points), 0)
        const emergencyPoints = checkScores
            .filter((check) => !check.dropped && !check.invalid)
            .map((check) => check.emergencyPoints)
            .reduce((prev, cur) => (prev + cur), 0)
        const disqualified = checkScores
            .filter((check) => !check.dropped && !check.invalid)    
            .some((check => check.disqualified))
        
        // const nonDroppedChecks = enduro.checkpoints.length - enduro.checkpoints.filter((v) => v.drop).length
        const nonDroppedChecks = checkScores
            .map((check, index) => (check.invalid || scoringChecks[index]?.check.drop) ? 0 : 1)
            .reduce((prev: number, cur: number) => (prev + cur), 0)
        
        return {
            points,
            emergencyPoints,
            disqualified,
            checkScores,
            nonDroppedChecks
        }
    }
}
