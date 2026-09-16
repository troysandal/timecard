/**
 * AMA Specific Scoring
 * 
 * Contains the scoring rules for AMA Time Keeping Enduros. Does not mix in other
 * format scoring to avoid cross contamination.
 * 
 * [AMA National Format](https://ecea.org/ecea/enduro-time-keeping/)
 */

import type { Checkpoint } from "./timekeeper"
import { CheckScoring, type ScoreContext, type Score } from "./timekeeper.scoring.base"

/**
 * Start Control 
 * 
 * A known starting checkpoint for an enduro or a section of an enduro. 
 * Marked by a yellow flag with letters ST in black.  Riders’ times are 
 * recorded.  No penalty points are accrued for being early, but points are 
 * awarded for being late.  Riders leave a start control on the minute 
 * corresponding to their number.
*/
export class StartScoring extends CheckScoring {
    constructor(check: Checkpoint) {
        super(check)
    }

    scoreImpl(context: ScoreContext): Score {
        return { 
            points: this.points(context.startingMinute),
            emergencyPoints: 0,
            dropped: this.check.drop,
            disqualified: this.disqualified(context),
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

    disqualified(context: ScoreContext): boolean {
        // @todo - AMA National hour out at 60:59 (61)
        // This is hard, e.g. if on minute 1 at key time of 9:00 what does
        // the club write to indicate DQ?
        // Clock time - >= 10:02 (looks like an emergency)
        // DQ ?
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
export class SecretScoring extends CheckScoring {
    constructor(check: Checkpoint) {
        super(check)
    }

    scoreImpl(context: ScoreContext): Score {
        return { 
            points: this.points(context.startingMinute),
            emergencyPoints: this.emergencyPoints(context.startingMinute),
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
 * Known Control
 *
 * A known checkpoint on the enduro course, usually at a gas stop, or at the 
 * finish.  Marked by a yellow flag with the letter K in black.  There is no 
 * penalty for being up to 15 minutes early, but late points are accumulated.  
 * Arriving more than 15 minutes early results in disqualification.
*/
export class KnownScoring extends StartScoring {
    constructor(check: Checkpoint) {
        super(check)
    }

    disqualified(context: ScoreContext): boolean {
        return (context.startingMinute - this.check.minute) > 15
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
export class EmergencyScoring extends SecretScoring {
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
