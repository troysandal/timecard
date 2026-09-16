/**
 * Time Keeping Enduro Scoring
 * 
 * Score Keeping logice for both time keeping enduro types.  Scoring is kept
 * generic for each enduro, leaving format rules in different TS modules.
 * 
 * Scoring Formats Supported
 * - [AMA National Format](https://ecea.org/ecea/enduro-time-keeping/)
 * - [NETRA Brand X](https://www.netra.org/wp-content/uploads/2023/03/2023-NETRA-Enduro-Rules.pdf)
 */

import type { Checkpoint } from "./timekeeper"
import { CheckpointTypes, TimeKeeperEnduro } from "./timekeeper"
import * as AMA from "./timekeeper.scoring.ama"
import * as BrandX from "./timekeeper.scoring.brandx"
import { type ScoreContext, ScoreFormat, CheckScoring, type ScoreCard } from "./timekeeper.scoring.base"

export { ScoreFormat, type Score } from "./timekeeper.scoring.base"

/**
 * Scores a time keeping enduro of a given format.  Every checkpoint is scored 
 * to our best ability.  When a checkpoint has invalid minutes or seconds a 
 * score of 0 is still returned and `score.invalid=true`.  For dropped checks
 * a score is still produced but for enduros where the rider minute changes
 * this can produce wonky numbers so display as you see fit.
 */
export class ScoreKeeper {
    format:ScoreFormat = ScoreFormat.AMA_National
    
    constructor(format:ScoreFormat) {
        this.format = format
    }

    static checkToScoring(format: ScoreFormat, check: Checkpoint): CheckScoring {
        const modules: Record<ScoreFormat, typeof AMA | typeof BrandX>  = {
            [ScoreFormat.AMA_National]: AMA,
            [ScoreFormat.NETRA_BrandX]: BrandX
            };
        const factory = modules[format]
        if (!factory) {
                throw `Unknown enduro format ${format}`
        }

        switch (check.type) {
            case CheckpointTypes.Start:
                return new factory.StartScoring(check)
            case CheckpointTypes.Secret:
                return new factory.SecretScoring(check)
            case CheckpointTypes.Emergency:
                return new factory.EmergencyScoring(check)
            case CheckpointTypes.Known:
                return new factory.KnownScoring(check)
            default:
                throw `Unknown checkpoint type ${check.type}`
        }
    }
    
    scoreEnduro(enduro: TimeKeeperEnduro): ScoreCard {
        const scoringChecks = enduro.checkpoints
            .map((check) => {
                return ScoreKeeper.checkToScoring(enduro.format, check)
            })
        
        // Score Each Checkpoint
        const scoreContext: ScoreContext = {
            currentMinute: enduro.riderMinute,
            startingMinute: enduro.riderMinute
        }

        const checkScores = scoringChecks.map((scorer) => {
            const score = scorer.score(scoreContext)

            if (!score.dropped && !score.invalid) {
                scoreContext.currentMinute = scorer.check.minute
            }
            return score
        })

        // Compute Overall Totals
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
        const nonDroppedChecks = checkScores
            .map((check, index) => (check.invalid || check.dropped) ? 0 : 1)
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
