import { type TimeKeeperRace, } from '../models/race';
import { ScoreKeeper } from '../lib/scoring/timekeeper.scoring';
import { areEqual, CheckpointTypes, type Checkpoint } from "../models/timekeeper"
import type { RaceViewModel, TimeKeeperScore } from './ViewModelTypes';

export class TimeKeeperViewModel implements RaceViewModel<TimeKeeperRace, TimeKeeperScore> {
  readonly kind = 'time_keeper';
  race: TimeKeeperRace;
  raceLKG: TimeKeeperRace;

  constructor(race: TimeKeeperRace) {
    this.race = $state($state.snapshot(race));
    this.raceLKG = $state($state.snapshot(race));
  }

  get score(): TimeKeeperScore {
    return {
      kind: 'time_keeper',
      scoreCard: ScoreKeeper.scoreEnduro(this.race.timeCard)
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
    return this.race.timeCard.checkpoints[this.race.timeCard.checkpoints.length - 1] 
  }

  deleteCheck(check: Checkpoint) {
    this.race.timeCard.checkpoints = this.race.timeCard.checkpoints.filter((c) => c !== check)
  }

  resetCard() {
    // this.race.timeCard.riderMinute = 1
    this.race.timeCard.checkpoints = this.initialChecks(1)
  }

  save(onSave: (race: TimeKeeperRace) => void) {
    this.raceLKG = $state.snapshot(this.race)
    onSave($state.snapshot(this.race))
  }

  get isDirty(): boolean {
    const l = this.race;
    const r = this.raceLKG;

    return (l.name != r.name) || 
           !areEqual($state.snapshot(l.timeCard), $state.snapshot(r.timeCard))
  }
}
