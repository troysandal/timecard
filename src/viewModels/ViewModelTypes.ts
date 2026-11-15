import { type Race, type RaceType } from '../models/race';
import { type ScoreCard } from "../lib/scoring/timekeeper.scoring.base"
import { type TimeData } from '../models/sprint';

// Each score carries a `kind`, so the Score component can narrow it without casts.
export type SprintScore = { kind: 'sprint'; score: TimeData };
export type TimeKeeperScore = { kind: 'time_keeper'; scoreCard: ScoreCard };
export type AnyScore = SprintScore | TimeKeeperScore;


export interface RaceViewModel<TRace extends Race, TScore extends AnyScore> {
  readonly kind: RaceType;
  readonly race: TRace;
  readonly raceLKG: TRace;
  readonly score: TScore;
  readonly isDirty: boolean;

  save(onSave: (race: TRace) => void): void;
}

export type ScanApplyResult = 'applied' | 'empty' | 'cancelled' | 'failed';
