/**
 * @todo - Implement isDirty
 */
import type { TimeKeeperRace, Race, RaceType, SprintRace } from '../models/race';
import { type ScoreCard } from "../lib/scoring/timekeeper.scoring.base"
import { ScoreKeeper } from '../lib/scoring/timekeeper.scoring';
import { areEqual, CheckpointTypes, type Checkpoint } from "../models/timekeeper"

// Each score carries a `kind`, so the Score component can narrow it without casts.
export type SprintScore = { kind: 'sprint'; points: number };
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


export class SprintViewModel implements RaceViewModel<SprintRace, SprintScore> {
  readonly kind = 'sprint'; // literal type: this is what makes AnyRaceViewModel narrowable
  race: SprintRace;
  raceLKG: SprintRace;

  constructor(race: SprintRace) {
    this.race = $state($state.snapshot(race));
    this.raceLKG = $state($state.snapshot(race));
  }

  get score(): SprintScore {
    return {
      kind: 'sprint',
      points: this.race.timeCard.score
    };
  }

  save(onSave: (race: SprintRace) => void) {
    const saved = $state.snapshot(this.race)
    onSave(saved)
    this.raceLKG = saved
  }

  // @todo - implement isDirty
  get isDirty(): boolean {
    return true;
  }
}

export class TimeKeeperViewModel implements RaceViewModel<TimeKeeperRace, TimeKeeperScore> {
  readonly kind = 'time_keeper';
  race: TimeKeeperRace;
  raceLKG: TimeKeeperRace;

  constructor(race: TimeKeeperRace) {
    this.race = $state($state.snapshot(race));
    this.raceLKG = $state($state.snapshot(race));
  }

  get score(): TimeKeeperScore {
    const checks = this.race.timeCard.checkpoints;
    // @todo - won't scoreEnduro already give us this?
    let scoreCard = {
        points: 0,
        emergencyPoints: 0,
        disqualified: false,
        checkScores: Array(checks.length).fill(null),
        nonDroppedChecks: checks.length - checks.filter((v) => v.drop).length,
    }

    if (!isNaN(this.race.timeCard.riderMinute)) {
      scoreCard = ScoreKeeper.scoreEnduro(this.race.timeCard)
    }

    return {
      kind: 'time_keeper',
      scoreCard: scoreCard
    };
  }

  private initialChecks(MAX: number): Checkpoint[] {
      const checks: Checkpoint[] = []
      for (let i = 0 ; i < MAX ; i++) {
        checks.push({
          type: CheckpointTypes.Secret,
          minute: this.race.timeCard.riderMinute,
          seconds: 30,
          drop: false
        } as Checkpoint)
      }
      return checks
  }

  addCheck() {
    this.race.timeCard.checkpoints[this.race.timeCard.checkpoints.length] = {
      type: CheckpointTypes.Secret,
      minute: this.race.timeCard.riderMinute,
      seconds: 30,
      drop: false
    }
  }

  resetCard() {
    if (window.confirm('Are you sure you want to reset the time card?')) {
        this.race.timeCard.riderMinute = 1
        this.race.timeCard.checkpoints = this.initialChecks(5)
    }
  }

  save(onSave: (race: TimeKeeperRace) => void) {
    const saved = $state.snapshot(this.race)
    onSave(saved)
    this.raceLKG = saved
  }

  get isDirty(): boolean {
    const l = this.race;
    const r = this.raceLKG;

    return (l.name != r.name) || 
           !areEqual($state.snapshot(l.timeCard), $state.snapshot(r.timeCard))
  }
}

export type AnyRaceViewModel = SprintViewModel | TimeKeeperViewModel;

/** The one place that maps a race to its view model. */
export function createViewModel(race: Race): AnyRaceViewModel {
  switch (race.raceType) {
    case 'sprint':
      return new SprintViewModel(race);
    case 'time_keeper':
      return new TimeKeeperViewModel(race);
    default: {
      // Adding a new race type without handling it here is a compile error.
      const exhaustive: never = race;
      throw new Error(`Unknown race: ${JSON.stringify(exhaustive)}`);
    }
  }
}
