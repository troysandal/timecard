/**
 * Time Keeper Scoring - Common
 * 
 * All common types, interfaces and classes for scoring time keepers.
 */

import type { Checkpoint } from "./timekeeper"

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
    AMA_National = "AMA",
    NETRA_BrandX = "BrandX"
}

export interface ScoreContext {
    // Rider start row - stays fixed when scoring
    startingMinute: number

    // Initiallized to rider start row at first check, then changes to the
    // minute of the last valid/undropped check the rider came into. This
    // allows for Brand X scoring where the minute changes when you are 
    // early or late.
    currentMinute: number
}


export abstract class CheckScoring {
    check: Checkpoint

    constructor(check: Checkpoint) {
        this.check = check
    }

    // Handles invalid minute/time which must still return a score
    readonly score = (context: ScoreContext): Score => {
        let score: Score = { 
            points: 0, 
            emergencyPoints: 0, 
            dropped: this.check.drop, 
            disqualified: false, 
            invalid: false
        }

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
