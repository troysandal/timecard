/**
 * Brand X Specific Scoring
 * 
 * Contains the scoring rules for NETRA Brand X Time Keeping Enduros. Does not
 * mix in other format scoring to avoid cross contamination.
 * 
 * [NETRA Brand X](https://www.netra.org/wp-content/uploads/2023/03/2023-NETRA-Enduro-Rules.pdf)
 */


import type { Checkpoint } from "./timekeeper"
import { type ScoreContext, type Score, CheckScoring } from "./timekeeper.scoring.base"

/**
 * Start Control 
 * 
 * A known starting checkpoint for an enduro or a section of an enduro. 
 * Marked by a yellow flag with letters ST in black.  Riders’ times are 
 * recorded.  No penalty points are accrued for being early, but points are 
 * awarded for being late.  Riders leave a start control on the minute 
 * corresponding to their number.
 * 
 * NETRA Rule A.2
 * Scoring at the Start. A rider shall be penalized one point for every minute
 * late in departing from Starting Control (Known Control).
 */
export class StartScoring extends CheckScoring {
    constructor(check: Checkpoint) {
        super(check)
    }

    scoreImpl(context: ScoreContext): Score {
        return { 
            points: this.points(context.currentMinute),
            emergencyPoints: 0,
            dropped: this.check.drop,
            disqualified: false,
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

}

/**
 * Secret Check
 * 
 * An unknown checkpoint location on the course.  Marked by a half red, half
 * white flag with the letters ST in black.
 * 
 * NETRA Rule A.1
 * Scoring at Timed Checks. A rider shall be penalized two points for the first
 * minute early, five points for each additional minute early, or one point for
 * each minute late upon arrival at a Secret or Emergency
 * 
 * NETRA Rule A.4
 * Emergency Checks and Secret Checks shall be combined and, in such cases,
 * only emergency markers will be displayed. For scoring purposes, scores will
 * be computed as though the checks were operated separately. A rider shall be
 * penalized one emergency point for each second early or late at an Emergency
 * Check when a tie must be broken. Emergency points shall be figured from the
 * 30 second mark of his due minute.
 */
export class SecretScoring extends CheckScoring {
    constructor(check: Checkpoint) {
        super(check)
    }

    scoreImpl(context: ScoreContext): Score {
        return { 
            points: this.points(context.currentMinute),
            emergencyPoints: this.emergencyPoints(context.currentMinute),
            dropped: this.check.drop,
            disqualified: this.disqualified(context),
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

    disqualified(context: ScoreContext): boolean {
        return (context.currentMinute - this.check.minute) > 5
    }
}

/**
 * Known Control
 *
 * A known checkpoint on the enduro course, usually at a gas stop, or at the 
 * finish.  Marked by a yellow flag with the letter K in black. 
 * 
 * NETRA Rule A.4
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
export class KnownScoring extends CheckScoring {
    constructor(check: Checkpoint) {
        super(check)
    }

    scoreImpl(context: ScoreContext): Score {
        return { 
            points: this.points(context.currentMinute, context.startingMinute),
            emergencyPoints: 0,
            dropped: this.check.drop,
            disqualified: false,
            invalid: false
        }
    }

    points(riderMinute: number, startMinute: number): number {
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
 * a half green, half white flag with a black letter E.  
 * 
 * NETRA Rule A.1
 * Scoring at Timed Checks. A rider shall be penalized two points for the first
 * minute early, five points for each additional minute early, or one point for
 * each minute late upon arrival at a Secret or Emergency
 * 
 * NETRA Rule A.4
 * Emergency Checks and Secret Checks shall be combined and, in such cases,
 * only emergency markers will be displayed. For scoring purposes, scores will
 * be computed as though the checks were operated separately. A rider shall be
 * penalized one emergency point for each second early or late at an Emergency
 * Check when a tie must be broken. Emergency points shall be figured from the
 * 30 second mark of his due minute.
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
